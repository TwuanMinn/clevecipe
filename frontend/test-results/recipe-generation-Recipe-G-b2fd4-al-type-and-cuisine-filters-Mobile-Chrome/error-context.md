# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e4]:
    - banner [ref=e5]:
      - generic [ref=e7]:
        - button [ref=e8] [cursor=pointer]:
          - img [ref=e9]
        - heading "Generate Recipe" [level=1] [ref=e11]
    - generic [ref=e12]:
      - generic [ref=e13]:
        - img [ref=e15]
        - heading "Generate New Recipe" [level=1] [ref=e18]
        - paragraph [ref=e19]: Tell us what you're in the mood for, and our AI will craft the perfect recipe.
      - generic [ref=e20]:
        - generic [ref=e21]: What meal are you planning?
        - generic [ref=e22]:
          - button "Any Meal" [ref=e23] [cursor=pointer]: Any Meal
          - button "Breakfast" [ref=e25] [cursor=pointer]
          - button "Lunch" [ref=e26] [cursor=pointer]
          - button "Dinner" [ref=e27] [cursor=pointer]
          - button "Snack" [ref=e28] [cursor=pointer]
      - generic [ref=e29]:
        - generic [ref=e30]: Preferred cuisine
        - generic [ref=e31]:
          - button "Any Cuisine" [ref=e32] [cursor=pointer]: Any Cuisine
          - button "Italian 🍝" [ref=e34] [cursor=pointer]
          - button "Asian 🍜" [ref=e35] [cursor=pointer]
          - button "Mexican 🌮" [ref=e36] [cursor=pointer]
          - button "Indian 🍛" [ref=e37] [cursor=pointer]
          - button "Mediterranean 🫒" [ref=e38] [cursor=pointer]
      - button "Generate Recipes" [ref=e39] [cursor=pointer]:
        - img
        - text: Generate Recipes
```