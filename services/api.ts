import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const rawBaseQuery = fetchBaseQuery({ baseUrl: '/api' });

/**
 * Retries failed reads, twice, with a short backoff.
 *
 * A read that fails once is left permanently empty otherwise — RTK Query does
 * not retry on its own — so a single hiccup on a cold serverless start used to
 * leave a section blank until the visitor reloaded the page.
 *
 * Reads only. A retried POST or DELETE could duplicate or repeat a write, so
 * anything that is not a GET is passed straight through.
 */
const baseQueryWithRetry: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const method = typeof args === 'string' ? 'GET' : (args.method ?? 'GET');
  let result = await rawBaseQuery(args, api, extraOptions);

  if (method.toUpperCase() !== 'GET') return result;

  for (let attempt = 1; attempt <= 2 && result.error; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
    result = await rawBaseQuery(args, api, extraOptions);
  }

  return result;
};

export const portfolioApi = createApi({
  reducerPath: 'portfolioApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: [
    'Profile',
    'About',
    'SEO',
    'Settings',
    'Skills',
    'Projects',
    'Experience',
    'Education',
    'Gallery',
    'Testimonials',
    'Blog',
    'Messages',
    'Media',
  ],
  endpoints: (builder) => ({
    // ======================================== STATS ========================================== //

    /**
     * Aggregate counts for /admin/analytics, computed in Mongo.
     *
     * Invalidated by every content tag so editing a project or reading a
     * message refreshes the figures without a manual reload.
     */
    getAdminStats: builder.query<any, void>({
      query: () => '/admin/stats',
      providesTags: [
        'Projects',
        'Blog',
        'Gallery',
        'Messages',
        'Experience',
        'Education',
        'Testimonials',
        'Skills',
        'Media',
      ],
    }),

    // ======================================== PROFILE ======================================== //

    getProfile: builder.query<any, void>({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<any, any>({
      query: (profile) => ({
        url: '/profile',
        method: 'PUT',
        body: profile,
      }),
      invalidatesTags: ['Profile'],
    }),

    // ======================================== ABOUT ======================================== //

    getAbout: builder.query<any, void>({
      query: () => '/about',
      providesTags: ['About'],
    }),

    updateAbout: builder.mutation<any, any>({
      query: (about) => ({
        url: '/about',
        method: 'PUT',
        body: about,
      }),
      invalidatesTags: ['About'],
    }),

    // ======================================== SEO ======================================== //

    getSeo: builder.query<any, void>({
      query: () => '/seo',
      providesTags: ['SEO'],
    }),

    updateSeo: builder.mutation<any, any>({
      query: (seo) => ({
        url: '/seo',
        method: 'PUT',
        body: seo,
      }),
      invalidatesTags: ['SEO'],
    }),

    // ======================================== SETTINGS ======================================== //

    getSettings: builder.query<any, void>({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),

    updateSettings: builder.mutation<any, any>({
      query: (settings) => ({
        url: '/settings',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['Settings'],
    }),

    // ======================================== SKILLS ======================================== //

    getSkills: builder.query<any[], void>({
      query: () => '/skills',
      providesTags: ['Skills'],
    }),

    addSkill: builder.mutation<any, any>({
      query: (skill) => ({
        url: '/skills',
        method: 'POST',
        body: skill,
      }),
      invalidatesTags: ['Skills'],
    }),

    updateSkill: builder.mutation<any, any>({
      query: ({ _id, ...skill }) => ({
        url: '/skills',
        method: 'PUT',
        body: { _id, ...skill },
      }),
      invalidatesTags: ['Skills'],
    }),

    deleteSkill: builder.mutation<any, string>({
      query: (_id) => ({
        url: `/skills?id=${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Skills'],
    }),

    updateSkillOrder: builder.mutation<any, { orderedIds: string[] }>({
      query: ({ orderedIds }) => ({
        url: '/skills',
        method: 'PATCH',
        body: { orderedIds },
      }),
      invalidatesTags: ['Skills'],
    }),

    // ======================================== PROJECTS ======================================== //

    getProjects: builder.query<any[], void>({
      query: () => '/projects',
      providesTags: ['Projects'],
    }),

    getProject: builder.query<any, string>({
      query: (id) => `/projects/${id}`,
      providesTags: ['Projects'],
    }),

    addProject: builder.mutation<any, any>({
      query: (project) => ({
        url: '/projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: ['Projects'],
    }),

    updateProject: builder.mutation<any, any>({
      query: ({ _id, ...project }) => ({
        url: '/projects',
        method: 'PUT',
        body: { _id, ...project },
      }),
      invalidatesTags: ['Projects'],
    }),

    deleteProject: builder.mutation<any, string>({
      query: (_id) => ({
        url: `/projects?id=${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects'],
    }),

    updateProjectOrder: builder.mutation<any, { orderedIds: string[] }>({
      query: ({ orderedIds }) => ({
        url: '/projects',
        method: 'PATCH',
        body: { orderedIds },
      }),
      invalidatesTags: ['Projects'],
    }),

    // ======================================== EXPERIENCE ======================================== //

    getExperiences: builder.query<any[], void>({
      query: () => '/experience',
      providesTags: ['Experience'],
    }),

    addExperience: builder.mutation<any, any>({
      query: (experience) => ({
        url: '/experience',
        method: 'POST',
        body: experience,
      }),
      invalidatesTags: ['Experience'],
    }),

    updateExperience: builder.mutation<any, any>({
      query: ({ _id, ...experience }) => ({
        url: '/experience',
        method: 'PUT',
        body: { _id, ...experience },
      }),
      invalidatesTags: ['Experience'],
    }),

    deleteExperience: builder.mutation<any, string>({
      query: (_id) => ({
        url: `/experience?id=${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Experience'],
    }),

    updateExperienceOrder: builder.mutation<any, { orderedIds: string[] }>({
      query: ({ orderedIds }) => ({
        url: '/experience',
        method: 'PATCH',
        body: { orderedIds },
      }),
      invalidatesTags: ['Experience'],
    }),

    // ======================================== EDUCATION ======================================== //

    getEducation: builder.query<any[], void>({
      query: () => '/education',
      providesTags: ['Education'],
    }),

    addEducation: builder.mutation<any, any>({
      query: (education) => ({
        url: '/education',
        method: 'POST',
        body: education,
      }),
      invalidatesTags: ['Education'],
    }),

    updateEducation: builder.mutation<any, any>({
      query: ({ _id, ...education }) => ({
        url: '/education',
        method: 'PUT',
        body: { _id, ...education },
      }),
      invalidatesTags: ['Education'],
    }),

    deleteEducation: builder.mutation<any, string>({
      query: (_id) => ({
        url: `/education?id=${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Education'],
    }),

    updateEducationOrder: builder.mutation<any, { orderedIds: string[] }>({
      query: ({ orderedIds }) => ({
        url: '/education',
        method: 'PATCH',
        body: { orderedIds },
      }),
      invalidatesTags: ['Education'],
    }),

    // ======================================== GALLERY ======================================== //

    getGallery: builder.query<any[], void>({
      query: () => '/gallery',
      providesTags: ['Gallery'],
    }),

    addGalleryItem: builder.mutation<any, any>({
      query: (item) => ({
        url: '/gallery',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Gallery'],
    }),

    updateGalleryItem: builder.mutation<any, any>({
      query: ({ _id, ...item }) => ({
        url: '/gallery',
        method: 'PUT',
        body: { _id, ...item },
      }),
      invalidatesTags: ['Gallery'],
    }),

    deleteGalleryItem: builder.mutation<any, string>({
      query: (_id) => ({
        url: `/gallery?id=${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Gallery'],
    }),

    updateGalleryOrder: builder.mutation<any, { orderedIds: string[] }>({
      query: ({ orderedIds }) => ({
        url: '/gallery',
        method: 'PATCH',
        body: { orderedIds },
      }),
      invalidatesTags: ['Gallery'],
    }),

    // ======================================== TESTIMONIALS ======================================== //

    getTestimonials: builder.query<any[], void>({
      query: () => '/testimonials',
      providesTags: ['Testimonials'],
    }),

    addTestimonial: builder.mutation<any, any>({
      query: (testimonial) => ({
        url: '/testimonials',
        method: 'POST',
        body: testimonial,
      }),
      invalidatesTags: ['Testimonials'],
    }),

    updateTestimonial: builder.mutation<any, any>({
      query: ({ _id, ...testimonial }) => ({
        url: '/testimonials',
        method: 'PUT',
        body: { _id, ...testimonial },
      }),
      invalidatesTags: ['Testimonials'],
    }),

    deleteTestimonial: builder.mutation<any, string>({
      query: (_id) => ({
        url: `/testimonials?id=${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Testimonials'],
    }),

    updateTestimonialOrder: builder.mutation<any, { orderedIds: string[] }>({
      query: ({ orderedIds }) => ({
        url: '/testimonials',
        method: 'PATCH',
        body: { orderedIds },
      }),
      invalidatesTags: ['Testimonials'],
    }),

    // ======================================== BLOG ======================================== //

    getBlogs: builder.query<any[], void>({
      query: () => '/blog',
      providesTags: ['Blog'],
    }),

    addBlog: builder.mutation<any, any>({
      query: (blog) => ({
        url: '/blog',
        method: 'POST',
        body: blog,
      }),
      invalidatesTags: ['Blog'],
    }),

    updateBlog: builder.mutation<any, any>({
      query: ({ _id, ...blog }) => ({
        url: '/blog',
        method: 'PUT',
        body: { _id, ...blog },
      }),
      invalidatesTags: ['Blog'],
    }),

    deleteBlog: builder.mutation<any, string>({
      query: (_id) => ({
        url: `/blog?id=${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),

    // ======================================== MESSAGES ======================================== //

    getMessages: builder.query<any[], void>({
      query: () => '/contact',
      providesTags: ['Messages'],
    }),

    addMessage: builder.mutation<any, any>({
      query: (message) => ({
        url: '/contact',
        method: 'POST',
        body: message,
      }),
      invalidatesTags: ['Messages'],
    }),

    updateMessage: builder.mutation<any, any>({
      query: ({ _id, ...message }) => ({
        url: '/contact',
        method: 'PUT',
        body: { _id, ...message },
      }),
      invalidatesTags: ['Messages'],
    }),

    deleteMessage: builder.mutation<any, string>({
      query: (_id) => ({
        url: `/contact?id=${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Messages'],
    }),

    // ======================================== MEDIA ======================================== //

    getMedia: builder.query<any[], void>({
      query: () => '/media',
      providesTags: ['Media'],
    }),

    addMedia: builder.mutation<any, any>({
      query: (media) => ({
        url: '/media',
        method: 'POST',
        body: media,
      }),
      invalidatesTags: ['Media'],
    }),

    updateMedia: builder.mutation<any, any>({
      query: ({ _id, ...media }) => ({
        url: '/media',
        method: 'PUT',
        body: { _id, ...media },
      }),
      invalidatesTags: ['Media'],
    }),

    deleteMedia: builder.mutation<any, string>({
      query: (_id) => ({
        url: `/media?id=${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Media'],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAboutQuery,
  useUpdateAboutMutation,
  useGetSeoQuery,
  useUpdateSeoMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetSkillsQuery,
  useAddSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useUpdateSkillOrderMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectOrderMutation,
  useGetExperiencesQuery,
  useAddExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useUpdateExperienceOrderMutation,
  useGetEducationQuery,
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useUpdateEducationOrderMutation,
  useGetGalleryQuery,
  useAddGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
  useUpdateGalleryOrderMutation,
  useGetTestimonialsQuery,
  useAddTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useUpdateTestimonialOrderMutation,
  useGetBlogsQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetMessagesQuery,
  useAddMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
  useGetMediaQuery,
  useAddMediaMutation,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
} = portfolioApi;
