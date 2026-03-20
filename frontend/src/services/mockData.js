// Mock data for GitHub Pages deployment (frontend only)
// In production, replace with real API calls

export const mockRecipes = [
  {
    id: '1',
    name: 'Spaghetti Bolognese',
    description: 'Classic Italian pasta dish',
    category: 'dinner',
    prep_time: 15,
    cook_time: 45,
    servings: 4,
    instructions: '1. Cook pasta\n2. Make sauce\n3. Combine and serve',
    ingredients: [
      { id: '1-1', name: 'Spaghetti', quantity: 400, unit: 'g', category: 'pantry' },
      { id: '1-2', name: 'Ground beef', quantity: 500, unit: 'g', category: 'meat' },
      { id: '1-3', name: 'Tomato sauce', quantity: 1, unit: 'can', category: 'pantry' },
      { id: '1-4', name: 'Onion', quantity: 1, unit: 'piece', category: 'produce' },
      { id: '1-5', name: 'Garlic', quantity: 2, unit: 'cloves', category: 'produce' }
    ],
    created_at: '2024-03-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Greek Salad',
    description: 'Fresh Mediterranean salad',
    category: 'lunch',
    prep_time: 20,
    cook_time: 0,
    servings: 2,
    instructions: '1. Chop vegetables\n2. Mix with feta and olives\n3. Add dressing',
    ingredients: [
      { id: '2-1', name: 'Cucumber', quantity: 1, unit: 'piece', category: 'produce' },
      { id: '2-2', name: 'Tomatoes', quantity: 2, unit: 'pieces', category: 'produce' },
      { id: '2-3', name: 'Feta cheese', quantity: 100, unit: 'g', category: 'dairy' },
      { id: '2-4', name: 'Olives', quantity: 50, unit: 'g', category: 'pantry' },
      { id: '2-5', name: 'Olive oil', quantity: 2, unit: 'tbsp', category: 'pantry' }
    ],
    created_at: '2024-03-02T11:00:00Z'
  },
  {
    id: '3',
    name: 'Pancakes',
    description: 'Fluffy breakfast pancakes',
    category: 'breakfast',
    prep_time: 10,
    cook_time: 15,
    servings: 4,
    instructions: '1. Mix dry ingredients\n2. Add wet ingredients\n3. Cook on griddle',
    ingredients: [
      { id: '3-1', name: 'Flour', quantity: 200, unit: 'g', category: 'pantry' },
      { id: '3-2', name: 'Milk', quantity: 250, unit: 'ml', category: 'dairy' },
      { id: '3-3', name: 'Eggs', quantity: 2, unit: 'pieces', category: 'dairy' },
      { id: '3-4', name: 'Baking powder', quantity: 2, unit: 'tsp', category: 'pantry' },
      { id: '3-5', name: 'Sugar', quantity: 2, unit: 'tbsp', category: 'pantry' }
    ],
    created_at: '2024-03-03T09:00:00Z'
  }
];

export const mockMealPlans = [
  {
    id: 'plan-1',
    week_start: '2024-03-18',
    week_end: '2024-03-24',
    name: 'Spring Week Plan',
    notes: 'Trying some new recipes',
    created_at: '2024-03-17T15:00:00Z',
    planned_meals: [
      {
        id: 'meal-1',
        date: '2024-03-18',
        meal_type: 'dinner',
        location: 'home',
        people_count: 4,
        recipe_id: '1',
        recipe_name: 'Spaghetti Bolognese',
        notes: 'Monday family dinner'
      },
      {
        id: 'meal-2',
        date: '2024-03-19',
        meal_type: 'lunch',
        location: 'home',
        people_count: 2,
        recipe_id: '2',
        recipe_name: 'Greek Salad',
        notes: 'Light lunch'
      },
      {
        id: 'meal-3',
        date: '2024-03-20',
        meal_type: 'breakfast',
        location: 'home',
        people_count: 4,
        recipe_id: '3',
        recipe_name: 'Pancakes',
        notes: 'Wednesday special breakfast'
      }
    ]
  }
];

// Mock API functions for GitHub Pages deployment
export const mockApi = {
  recipes: {
    getAll: () => Promise.resolve(mockRecipes),
    getById: (id) => Promise.resolve(mockRecipes.find(r => r.id === id)),
    create: (recipe) => Promise.resolve({ ...recipe, id: Date.now().toString() }),
    update: (id, recipe) => Promise.resolve({ ...recipe, id }),
    delete: (id) => Promise.resolve(true),
    search: (query) => Promise.resolve(mockRecipes.filter(r => 
      r.name.toLowerCase().includes(query?.toLowerCase() || '') ||
      r.description.toLowerCase().includes(query?.toLowerCase() || '')
    )),
    getCategories: () => Promise.resolve([
      { category: 'breakfast', count: 1 },
      { category: 'lunch', count: 1 },
      { category: 'dinner', count: 1 }
    ])
  },
  
  mealPlans: {
    getAll: () => Promise.resolve(mockMealPlans),
    getById: (id) => Promise.resolve(mockMealPlans.find(p => p.id === id)),
    create: (plan) => Promise.resolve({ ...plan, id: `plan-${Date.now()}` }),
    update: (id, plan) => Promise.resolve({ ...plan, id }),
    delete: (id) => Promise.resolve(true),
    generate: (options) => {
      // Simple mock generation
      const generatedPlan = {
        week_start: options.week_start,
        week_end: options.week_end,
        name: `Generated Plan ${new Date().toLocaleDateString()}`,
        notes: 'Mock generated plan',
        planned_meals: mockRecipes.slice(0, 3).map((recipe, index) => ({
          date: new Date(Date.parse(options.week_start) + index * 86400000).toISOString().split('T')[0],
          meal_type: recipe.category,
          location: 'home',
          people_count: options.people_count || 1,
          recipe_id: recipe.id,
          recipe_name: recipe.name,
          notes: `Auto-generated ${recipe.category}`
        }))
      };
      return Promise.resolve(generatedPlan);
    }
  },
  
  health: () => Promise.resolve({ status: 'healthy', service: 'Mock API' })
};