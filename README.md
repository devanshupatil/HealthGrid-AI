# HealthGrid AI

**Privacy-Preserving Federated Machine Learning for Healthcare**

First Project Title Seminar, Dept. of AI & Data Science, KDK College of Engineering, Nagpur.

**Team:** Aditya Rathod, Purushottam Ghatul, Shweta Supe, Shweta Patil
**Guide:** Prof. Kartik Ingole

## About

Healthcare data is spread across hospitals and holds sensitive patient information. Collecting it in one central database raises privacy, security and data-sharing concerns.

HealthGrid AI uses **Federated Learning** instead. Each hospital trains a model on its own data and sends only the learned model update to a federated server. The server combines the updates with **Federated Averaging (FedAvg)** into a global model and sends it back for the next round. Raw patient records never leave the hospital.

This is an academic prototype. It runs entirely in the browser with **synthetic data** for three simulated hospitals (Hospital A, B and C).

## Features

- **Home page** with project information, objectives, methodology, roadmap, literature survey and team, plus a Login button
- **Dashboard** with global accuracy, training progress, the federated learning flow and a training log
- **Hospitals / Clients** with status, dataset size and details for each site
- **Federated Training** to start, pause, step and reset rounds, with per-hospital progress
- **Model Performance** with accuracy and loss charts for the global model and each hospital
- **Dataset** with synthetic datasets per hospital, a data profile, and a Regenerate button
- **Logs & Privacy** with the activity log, what is shared, and privacy techniques
- **Settings** for local epochs, learning rate and total rounds
- **Predictions** to try patient values and see the risk estimated by the global model
- **About the Project** with abstract, problem statement, objectives, methodology and literature survey

## How the simulation works

- Three hospitals get different synthetic patient data (non-IID), with four features: age, BMI, glucose and blood pressure.
- Each hospital trains a logistic regression model locally with mini-batch SGD.
- The server averages the updates weighted by each hospital's record count (FedAvg).
- The global model is tested on held-out records from every hospital.

On the default settings the global model rises from about 47% accuracy at round 0 to about 79% after the rounds complete.

## Tech stack

- React 19 + JavaScript
- Vite
- Tailwind CSS 3
- lucide-react, Radix Slot, class-variance-authority (UI components)

## Getting started

Requires [Bun](https://bun.sh) (Node.js also works).

```bash
cd FrountEnd
bun install
bun run dev        # start the dev server
bun run build      # production build into dist/
bun run preview    # preview the production build
```

## Project structure

```
FrountEnd/
├── index.html
├── tailwind.config.js        # theme tokens (colours, fonts, spacing)
└── src/
    ├── App.jsx               # login gate, page routing, shared training state
    ├── fl/
    │   ├── engine.js         # synthetic data, logistic regression, FedAvg
    │   └── useFederation.js  # training rounds as a React hook
    ├── pages/                # Home, Hospitals, Training, Performance, Dataset,
    │                         # Logs, Settings, Predictions, Project
    ├── components/           # Sidebar, TopBar, charts, illustrations
    │   └── ui/               # button, button-with-icon, logout-button
    └── lib/utils.js
```

## Notes and limits

- **Login is a demo.** Any username and password works. Nothing is stored or sent, and refreshing the page returns to the home page.
- **Privacy techniques:** secure aggregation and differential privacy are shown as *Planned*. They are not implemented.
- **Not medical advice.** Predictions come from synthetic data and are for demonstration only.

## Future work

- Secure aggregation and differential privacy
- Study how different hospital data distributions affect the global model
- Authorized EHR / API integration for real-world deployment

## References

- H. B. McMahan et al., *Communication-Efficient Learning of Deep Networks from Decentralized Data* (2017)
- T. S. Brisimi et al., *Federated Learning of Predictive Models from Federated Electronic Health Records* (2018)
- N. Rieke et al., *The Future of Digital Health with Federated Learning* (2020)
- M. J. Sheller et al., *Federated Learning in Medicine: Facilitating Multi-Institutional Collaborations Without Sharing Patient Data* (2020)
- P. Kairouz et al., *Advances and Open Problems in Federated Learning* (2021)
