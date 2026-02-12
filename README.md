# Frontend-Technical-Test

## Approach
I built the solution using vanilla JavaScript with a modular pattern to keep state, handlers, and rendering logic separated.
The application follows this approaches:
- Manages pagination, current data and UI state.
- Data is fetched once and stored as the original source, while filtered or paginated views are derived from it.
- The table renders data based on the current page.
- Navigation controls are generated dynamically.
- Filter methods update the state and trigger re-rendering.
- Favorites are persisted using localStorage, allowing data to remain after page reloads.
- The UI was styled using TailwindCSS, keeping the original structure and IDs to avoid breaking JavaScript behavior.

## Challenges Faced
- filtering data initially overwrote main dataset, causing to lose original data. 
- In the filter modal, reopening the filter dialog showed incomplete options because they where generated from already filterd data.

This challenges were resolved by maintaining an inmmutable copy of the fetched data and deriving most of all UI states from it.