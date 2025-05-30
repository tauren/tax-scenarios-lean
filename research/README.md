# Research Data

This directory contains research data and findings that inform our application development but are not directly used by the application.

## Directory Structure

```
research/
├── README.md
└── locations/           # Location-specific research
    └── location_research.json
```

## Usage

Research data in this directory is used to:
1. Inform the creation of template scenarios
2. Guide the development of qualitative concepts
3. Help define special tax features
4. Provide real-world context for our application's features

## Data Sources

- `locations/` - Contains research about potential tax-optimization locations
  - Generated using prompts from `prompts/research/`
  - Used to create template scenarios in `src/data/templateScenarios.data.ts`

## Contributing

When adding new research data:
1. Place it in the appropriate subdirectory
2. Update this README if adding new categories
3. Reference the prompt used to generate the data
4. Note any assumptions or limitations in the data 