import { NextResponse } from 'next/server';
import type { Model } from 'mongoose';
import _db from '@/utils/db';

// Admin edits must be visible immediately, so collection reads are never cached.
const NO_STORE = { 'Cache-Control': 'no-store' };

const fail = (message: string, status = 500) =>
  NextResponse.json({ error: message }, { status });

interface CrudOptions {
  /** Field name used for manual ordering. Pass null for collections that are not orderable. */
  orderField?: string | null;
  /** Mongo sort applied on GET. Defaults to ascending `orderField`. */
  sort?: Record<string, 1 | -1>;
  /** Human-readable resource name used in error messages. */
  label: string;
}

/**
 * Builds the standard GET / POST / PUT / PATCH / DELETE handlers for a collection resource.
 *
 * - GET    -> all documents, sorted
 * - POST   -> create one (auto-assigns the next order value)
 * - PUT    -> update one by `_id` in the body
 * - PATCH  -> reorder via `{ orderedIds: string[] }`
 * - DELETE -> remove one by `?id=` query param
 */
export function createCrudHandlers(model: Model<any>, options: CrudOptions) {
  const { orderField = 'order', label } = options;
  const sort = options.sort ?? (orderField ? { [orderField]: 1 as const } : { createdAt: -1 as const });

  const GET = async () => {
    try {
      await _db();
      const docs = await model.find({}).sort(sort).lean();
      return NextResponse.json(docs, { headers: NO_STORE });
    } catch (error) {
      console.error(`Error fetching ${label}:`, error);
      return fail(`Error fetching ${label}`);
    }
  };

  const POST = async (request: Request) => {
    try {
      await _db();
      const data = await request.json();

      if (orderField && data[orderField] === undefined) {
        const last = await model.findOne().sort({ [orderField]: -1 });
        data[orderField] = last ? (last as any)[orderField] + 1 : 0;
      }

      const created = await model.create(data);
      return NextResponse.json(created);
    } catch (error) {
      console.error(`Error creating ${label}:`, error);
      return fail(`Error creating ${label}`);
    }
  };

  const PUT = async (request: Request) => {
    try {
      await _db();
      const { _id, ...updateData } = await request.json();

      if (!_id) return fail(`${label} _id is required`, 400);

      const updated = await model.findByIdAndUpdate(_id, updateData, { new: true });
      if (!updated) return fail(`${label} not found`, 404);

      return NextResponse.json(updated);
    } catch (error) {
      console.error(`Error updating ${label}:`, error);
      return fail(`Error updating ${label}`);
    }
  };

  const PATCH = async (request: Request) => {
    try {
      await _db();
      const { orderedIds } = await request.json();

      if (!Array.isArray(orderedIds)) return fail('orderedIds must be an array', 400);
      if (!orderField) return fail(`${label} is not orderable`, 400);

      await Promise.all(
        orderedIds.map((id: string, index: number) =>
          model.findByIdAndUpdate(id, { [orderField]: index })
        )
      );

      return NextResponse.json({ message: `${label} order updated successfully` });
    } catch (error) {
      console.error(`Error reordering ${label}:`, error);
      return fail(`Error reordering ${label}`);
    }
  };

  const DELETE = async (request: Request) => {
    try {
      await _db();
      const id = new URL(request.url).searchParams.get('id');

      if (!id) return fail(`${label} id is required`, 400);

      const deleted = await model.findByIdAndDelete(id);
      if (!deleted) return fail(`${label} not found`, 404);

      return NextResponse.json({ message: `${label} deleted successfully` });
    } catch (error) {
      console.error(`Error deleting ${label}:`, error);
      return fail(`Error deleting ${label}`);
    }
  };

  return { GET, POST, PUT, PATCH, DELETE };
}

/**
 * Builds GET / PUT handlers for a single-document resource (profile, about, seo, settings).
 * GET seeds the document from `defaults` the first time it is requested.
 */
export function createSingletonHandlers(
  model: Model<any>,
  options: { label: string; defaults: Record<string, unknown> }
) {
  const { label, defaults } = options;

  const GET = async () => {
    try {
      await _db();
      let doc = await model.findOne({}).lean();

      if (!doc) {
        doc = (await model.create(defaults)).toObject();
      }

      return NextResponse.json(doc, { headers: NO_STORE });
    } catch (error) {
      console.error(`Error fetching ${label}:`, error);
      return fail(`Error fetching ${label}`);
    }
  };

  const PUT = async (request: Request) => {
    try {
      await _db();
      const { _id, ...updateData } = await request.json();

      const updated = await model.findOneAndUpdate(_id ? { _id } : {}, updateData, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      });

      return NextResponse.json(updated);
    } catch (error) {
      console.error(`Error updating ${label}:`, error);
      return fail(`Error updating ${label}`);
    }
  };

  return { GET, PUT };
}
