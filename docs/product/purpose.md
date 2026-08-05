# Purpose and people

## Product purpose

Recipe 99 is a personal meal-planning workspace that connects four everyday questions:

1. What food do I have?
2. What can I make with it?
3. What am I planning to eat on each day?
4. What still needs to be bought?

The application keeps each signed-in person's pantry, recipes, meal plan, serving amounts, and day-specific shopping needs separate. It continuously projects pantry availability forward through the plan, so a recipe's status reflects what earlier planned meals and shopping carts will have consumed or supplied.

## People and primary use case

The primary user is a person planning meals for themselves, a household, or guests. They need to move quickly between inventory, recipe choice, calendar planning, and shopping without manually recalculating quantities.

The core loop is:

1. Record or correct pantry quantities.
2. Find recipes that can be made now, or see exactly what is missing.
3. Arrange recipes on calendar days and set how many people each meal should serve.
4. Add shortfalls to the appropriate day's shopping cart.
5. Record what was acquired and decide what to do with any remaining shopping need.

## Authentication and personal data

- A user signs in with Google before entering the application.
- Pantry, planner, and recipe data are loaded for the authenticated user.
- The signed-in identity is visible, and the user can sign out.
- Authentication failures are surfaced on the sign-in screen.
