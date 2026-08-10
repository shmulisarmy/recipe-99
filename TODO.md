# Project

Project Description

<em>[TODO.md spec & Kanban Board](https://bit.ly/3fCwKfM)</em>

### Todo

- [ ] Plan and run a migration from legacy string unit values to the tagged builtin-unit object shape before relying on the new validator and UI.  

- [ ] Replace reference equality for units with value equality so equivalent builtin and custom unit objects compare correctly in measurement arithmetic and conversion controls.  

### In Progress


### Done ✓


- [ ] Remove or update the commented built-in-only selector implementations and the dormant unit-array conversion helper so they use the custom-unit shape correctly.  


- [ ] Update `Measurement_ToString` to render the builtin unit name or custom unit name, rather than coercing the full unit object to a string.  