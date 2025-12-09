#!/bin/bash
# Script to replace getImageSrc with DriveImage in all detail pages

files=(
  "src/pages/EducationDetail.jsx"
  "src/pages/WorkExperiences.jsx"
  "src/pages/WorkExperienceDetail.jsx"
  "src/pages/References.jsx"
  "src/pages/ReferenceDetail.jsx"
)

for file in "${files[@]}"; do
  # Replace import
  sed -i '' 's/import { getImageSrc } from/import DriveImage from/g' "$file"
  sed -i '' 's/"..\/utils\/imageUrl"/"..\/components\/DriveImage"/g' "$file"
done

echo "Done!"
