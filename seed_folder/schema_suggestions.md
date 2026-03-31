# Schema Suggestions (Optional)

Based on resume-style data and your current `Code.gs` table headers.

## Good as-is
- `projects`: name, description, skills
- `workexperiences`: company, position, startDate, endDate, description
- `educations`: school, degree, field, startYear, endYear, description
- `references`: name, relationship, contact
- `skills`: id, name, category

## Recommended additions
1. `users`
- add `fullName`
- add `phone`
- add `location`
- add `linkedinUrl`
- add `portfolioUrl`
- add `githubUrl`

2. `projects`
- add `demoUrl`
- add `repoUrl`
- add `startDate`
- add `endDate`

3. `workexperiences`
- add `employmentType` (full-time/part-time/intern)
- add `location`
- add `achievements` (bullet string or JSON)

4. `educations`
- add `gpa`
- add `location`

5. `skills`
- keep `category` for grouping in UI
- optional add `level` (beginner/intermediate/advanced)

6. `references`
- split `contact` into `email` and `phone` (optional)

## Important consistency note
- `workexperiences.startDate/endDate` currently look like full dates.
- `educations.startYear/endYear` are years.
Keeping this difference is okay, but if you want cleaner frontend filters, consider using full date fields for both.
