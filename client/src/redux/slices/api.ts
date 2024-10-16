import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const genrateBaseURL = (): string => {

  return '/api/v1';
}


export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: genrateBaseURL(),
    credentials: "include",
  }),
  endpoints: (builder) => ({
    bookCourt: builder.mutation<
      {
        success: boolean,
        message: string,  
        error: string
      }
      , any>({
        query: (runtime) => {
          return {
            url: "/bookings",
            method: "POST",
            body: runtime,
          };
        },
      }),
    addSite: builder.mutation<
      {
        success: boolean, 
        error: string, 
      }
      , any>({
        query: (runtime) => {
          return {
            url: "/sites",
            method: "POST",
            body: runtime,
          };
        },
      }),
    addCourt: builder.mutation<
      {
        success: boolean, 
        error: string
      }
      , any>({
        query: (runtime) => {
          return {
            url: "/courts",
            method: "POST",
            body: runtime
          };
        },
      }),
    fetchLocations: builder.query<{ 
      success: boolean,
      locations:{
         name:string,
         _id:string,
        }[],
        error?:string
      }, {}>({
      query: () => { 
        return {
          url: `/locations`,
          method: "GET",
        };
      },
    }),
    fetchCourts: builder.query<{ 
      success: boolean,
      courts:{
         type:string,
         _id:string,
        }[],
        error?:string
      }, {site_id:string}>({
      query: (runtime) => { 
        return {
          url: `/courts?site_id=${runtime.site_id}`,
          method: "GET",
        };
      },
    }),
    fetchBookings: builder.query<{ 
      success: boolean,
      bookings:{
        courtId:string,
         times:string[],
        }[],
        error?:string
      }, {site_id:string,courtType:string,date:string}>({
      query: (runtime) => { 
        return {
          url: `/bookings?site_id=${runtime.site_id}&courtType=${runtime.courtType}&date=${runtime.date}`,
          method: "GET",
        };
      },
    })
  }),
});

export const {
  useBookCourtMutation,
  useAddSiteMutation,
  useAddCourtMutation,
  useLazyFetchLocationsQuery,
  useLazyFetchCourtsQuery,
  useLazyFetchBookingsQuery
} = api;
