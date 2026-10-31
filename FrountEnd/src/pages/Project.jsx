import Medallion from '../components/Medallion'

const CARD = 'p-space-lg rounded-xl bg-surface-container-low shadow-xl'
const H = 'font-headline-md text-headline-md text-primary mb-space-sm'
const P = 'font-body-md text-body-md text-on-surface-variant leading-relaxed'

const OBJECTIVES = [
  ['Privacy', 'Keep raw healthcare data inside the local hospital environment.'],
  ['Collaborative Learning', 'Allow multiple hospitals to train one common ML model.'],
  ['Local Training', 'Train the model at each hospital using only its local dataset.'],
  ['Federated Server', 'Receive model updates and combine them using FedAvg.'],
  ['Global Model', 'Send the improved model back to hospitals for the next round.'],
  ['Prototype', 'Demonstrate the complete process using public or synthetic healthcare data.'],
]

const METHOD = [
  ['Data Preparation', 'Use public or synthetic healthcare data and divide it into separate datasets representing different hospitals.'],
  ['Local Client Setup', 'Create one federated client for each hospital so it can access only its own local data.'],
  ['Model Initialization', 'Create a common initial ML model and distribute it to all clients.'],
  ['Local Training', 'Each client trains the model locally without sending raw patient records to the server.'],
  ['Model Update', 'Each client sends only its trained model update to the federated server.'],
  ['Aggregation', 'The server combines the updates using Federated Averaging (FedAvg) to create the global model.'],
  ['Evaluation', 'Test the global model and repeat the training process for multiple rounds.'],
]

const FUTURE = [
  ['done', 'Complete the working prototype using three simulated hospital clients.'],
  ['done', 'Test multiple FedAvg training rounds and compare model performance.'],
  ['done', 'Build a simple dashboard for training status, model performance and predictions.'],
  ['partial', 'Study how different hospital data distributions affect the global model.'],
  ['planned', 'Add privacy techniques such as secure aggregation and differential privacy.'],
  ['planned', 'Explore authorized EHR/API integration for future real-world deployment.'],
]
const STATUS = {
  done: ['Built', 'bg-tertiary-container/20 text-tertiary'],
  partial: ['Partly', 'bg-primary/10 text-primary'],
  planned: ['Planned', 'bg-surface-container-highest text-outline'],
}

const LITERATURE = [
  ['H. Brendan McMahan (2017)', 'Communication-Efficient Learning of Deep Networks from Decentralized Data', 'Introduced FedAvg; healthcare-specific use is not addressed.'],
  ['Theodora S. Brisimi (2018)', 'Federated Learning of Predictive Models from Federated Electronic Health Records', 'Focused on EHR-based prediction; broader healthcare collaboration can be explored.'],
  ['Nicola Rieke (2020)', 'The Future of Digital Health with Federated Learning', 'Discussed digital-health applications; practical deployment still has challenges.'],
  ['Micah J. Sheller (2020)', 'Federated Learning in Medicine: Facilitating Multi-Institutional Collaborations Without Sharing Patient Data', 'Demonstrated medical collaboration; wider real-world deployment needs further work.'],
  ['Peter Kairouz (2021)', 'Advances and Open Problems in Federated Learning', 'Reviewed FL challenges and open problems; a complete healthcare prototype is not provided.'],
]

export default function Project() {
  return (
    <div className="flex flex-col gap-gutter relative z-10">
      <header className="max-w-3xl flex items-start gap-space-lg mb-space-md">
        <Medallion icon="menu_book" />
        <div className="flex flex-col gap-space-xs">
        <span className="font-telemetry-mono-sm text-telemetry-mono-sm text-primary tracking-widest uppercase">First Project Title Seminar</span>
        <h1 className="font-display-hero text-headline-xl text-on-surface tracking-tight uppercase font-light">
          HealthGrid AI <span className="text-primary italic font-normal font-display-hero">— Project Overview</span>
        </h1>
        <p className="font-body-lg text-body-md text-on-surface-variant">Privacy-Preserving Federated Machine Learning for Healthcare</p>
        <p className="font-telemetry-mono-sm text-telemetry-mono-sm text-outline">
          Aditya Rathod • Purushottam Ghatul • Shweta Supe • Shweta Patil — Guide: Prof. Kartik Ingole
        </p>
        </div>
      </header>

      <section className={CARD}>
        <h2 className={H}>Abstract</h2>
        <p className={P}>
          HealthGrid AI is a privacy-preserving Federated Learning system for collaborative Machine Learning in healthcare. Instead of collecting all patient records in one place, each hospital trains the model locally on its own data and sends only the learned model update to a federated server. The server aggregates the updates into an improved global model and sends it back for the next round. For the academic prototype, public or synthetic healthcare data represents the separate hospitals.
        </p>
      </section>

      <section className={CARD}>
        <h2 className={H}>Problem Statement</h2>
        <p className={`${P} mb-space-sm`}>Healthcare data is distributed across hospitals and contains sensitive patient information. A centralized approach would require sending records to a common database, creating privacy, security and data-sharing concerns.</p>
        <p className="font-body-lg text-body-lg text-on-surface font-semibold">How can multiple hospitals collaboratively train a Machine Learning model without sending their raw patient records to a central location?</p>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
        <section className={CARD}>
          <h2 className={H}>Objectives</h2>
          <ul className="flex flex-col gap-space-sm">
            {OBJECTIVES.map(([t, d]) => (
              <li key={t} className={P}><span className="text-on-surface font-semibold">{t}: </span>{d}</li>
            ))}
          </ul>
        </section>
        <section className={CARD}>
          <h2 className={H}>Methodology</h2>
          <ol className="flex flex-col gap-space-sm list-decimal list-inside">
            {METHOD.map(([t, d]) => (
              <li key={t} className={P}><span className="text-on-surface font-semibold">{t}: </span>{d}</li>
            ))}
          </ol>
        </section>
      </div>

      <section className={CARD}>
        <h2 className={H}>Plan for Future Work</h2>
        <ul className="flex flex-col gap-space-sm">
          {FUTURE.map(([s, t]) => (
            <li key={t} className="flex items-start justify-between gap-space-md">
              <span className={P}>{t}</span>
              <span className={`font-telemetry-mono-sm text-telemetry-mono-sm px-space-xs py-0.5 rounded whitespace-nowrap ${STATUS[s][1]}`}>{STATUS[s][0]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={CARD}>
        <h2 className={H}>Literature Survey</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead>
              <tr className="text-outline font-label-caps text-label-caps uppercase tracking-wider">
                <th className="pb-space-sm">Sr.</th><th className="pb-space-sm">Article Reviewed</th><th className="pb-space-sm">Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {LITERATURE.map(([a, t, g], i) => (
                <tr key={a} className="align-top">
                  <td className="py-space-sm pr-space-md font-telemetry-mono text-primary">{i + 1}.</td>
                  <td className="py-space-sm pr-space-md text-on-surface-variant"><span className="text-on-surface">{a}</span> – {t}</td>
                  <td className="py-space-sm text-on-surface-variant">{g}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
