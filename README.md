# Talla Desktop App

A desktop application for visualizing and analyzing Talla data, built with Electron and React.

## Features

- 📊 Interactive positioning data visualization
- 🔄 Support for different frame rates (FPS)
- 📁 Local CSV file management
- 📈 TDoA hyperbola plotting
- 📊 Link quality analysis
- 🎥 Visualization recording
- 🎨 Customizable colors and visualizations

## Technologies

- Electron
- React
- Plotly.js
- PrimeReact
- NextUI
- TailwindCSS
- Python (for data processing)

## Prerequisites

- Node.js (>= 14.0.0)
- Python (>= 3.8)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourUsername/Talla-Desktop-App.git
```

2. Install dependencies:
```bash
cd Talla-Desktop-App
npm install
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Development Mode

```bash
npm run start
```

### Distribution Build

```bash
npm run make
```

The compiled application will be available in the `out/` folder.

## Workspace Structure

The application creates a `TallaWorkspace` folder in the user's Documents directory to manage work files.

## Main Features

### Campaign Management
- Create and manage campaign groups
- Upload CSV and ZIP files
- Hierarchical data organization

### Data Visualization
- Animated positioning data playback
- TDoA hyperbola visualization
- Link quality analysis
- Customizable playback controls

### Analysis Tools
- Tag selection and filtering
- Playback speed control
- Graph export
- Visualization recording

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contact

For questions or bug reports, please open an issue in the repository.
