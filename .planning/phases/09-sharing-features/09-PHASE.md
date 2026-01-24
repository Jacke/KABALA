# Phase 9: Sharing Features

## Goal
Enable shareable URLs and social media previews for city comparisons and pages.

## Dependencies
- Phase 6: City Comparison (URL state already implemented)
- Phase 4: City Details (metadata already implemented)

## Already Completed
- URL state for comparisons (/compare?cities=berlin,moscow&home=berlin) - Done in Phase 6
- Basic metadata for city pages - Done in Phase 4

## Plans

### Plan 09-01: Enhanced metadata and sharing
Review and enhance existing metadata, add calculator URL state.

**Deliverables:**
- Review existing metadata on all pages
- Add URL state to calculator page
- Ensure all pages have proper meta tags

### Plan 09-02: OG image generation
Create dynamic Open Graph images for social sharing.

**Deliverables:**
- OG image route using Next.js ImageResponse
- Dynamic images for city pages
- Dynamic images for comparisons
- Fallback static image

## Success Criteria
- All pages have proper OG meta tags
- Dynamic OG images generate correctly
- Social sharing previews look good
- No TypeScript errors
- Build succeeds
