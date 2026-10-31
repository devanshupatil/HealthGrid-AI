import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Icon from '../components/Icon'
import LuxBackground from '../components/LuxBackground'
import ButtonWithIcon from '@/components/ui/button-with-icon'
import HeroVisual from '../components/HeroVisual'
import DashPreview from '../components/DashPreview'

const CARD = 'p-space-lg rounded-xl bg-surface-container-low shadow-xl'
const P = 'font-body-md text-body-md text-on-surface-variant leading-relaxed'
const EYEBROW = 'font-telemetry-mono-sm text-telemetry-mono-sm text-primary tracking-widest uppercase'
const WRAP = 'w-full px-6 md:px-12 2xl:px-20'
const RULE = 'border-t border-outline-variant/25'

const NAV = [['about', 'About'], ['objectives', 'Objectives'], ['how', 'How It Works'], ['dashboard', 'Dashboard'], ['privacy', 'Privacy'], ['research', 'Research'], ['team', 'Team']]

const STATS = [['3', 'Hospital clients'], ['0', 'Raw records shared'], ['FedAvg', 'Aggregation method'], ['4', 'Patient features']]

const STEPS = [
  ['Local Training', 'Each hospital trains the model on its own data, inside its own environment.'],
  ['Send Update', 'Only the learned model weights travel to the federated server, never patient records.'],
  ['Aggregate', 'The server combines every update with Federated Averaging into one global model.'],
  ['Redistribute', 'The improved global model returns to all hospitals for the next round.'],
]

const PRIVACY = [
  ['Data stays local', 'Patient records never leave the hospital that holds them.'],
  ['Only updates are shared', 'The server receives model parameters, not rows of data.'],
  ['Secure aggregation', 'Planned. Updates will be combined so no single one is visible.'],
  ['Differential privacy', 'Planned. Calibrated noise will further limit what updates reveal.'],
]

const OBJECTIVES = [
  ['Privacy', 'Keep raw healthcare data inside the local hospital environment.'],
  ['Collaborative Learning', 'Allow multiple hospitals to train one common ML model.'],
  ['Local Training', 'Train the model at each hospital using only its local dataset.'],
  ['Federated Server', 'Receive model updates and combine them using FedAvg.'],
  ['Global Model', 'Send the improved model back to hospitals for the next round.'],
  ['Prototype', 'Demonstrate the full process using public or synthetic healthcare data.'],
]

const METHOD = [
  ['Data Preparation', 'Split public or synthetic healthcare data into separate datasets, one per hospital.'],
  ['Local Client Setup', 'Create one federated client per hospital, with access to its own data only.'],
  ['Model Initialization', 'Create a common starting model and distribute it to all clients.'],
  ['Local Training', 'Each client trains locally without sending raw records to the server.'],
  ['Model Update', 'Each client sends only its trained model update to the server.'],
  ['Aggregation', 'The server combines the updates using Federated Averaging (FedAvg).'],
  ['Evaluation', 'Test the global model and repeat the process for multiple rounds.'],
]

const DASH = [
  ['dashboard', 'Dashboard', 'Global accuracy, training progress and the live federated learning flow.'],
  ['local_hospital', 'Hospitals / Clients', 'Status, dataset size and last update for Hospital A, B and C.'],
  ['model_training', 'Federated Training', 'Start, pause and step through rounds with per-hospital progress.'],
  ['monitoring', 'Model Performance', 'Accuracy and loss charts for the global model and each hospital.'],
  ['database', 'Dataset', 'Synthetic datasets per hospital, with the option to regenerate them.'],
  ['shield', 'Logs & Privacy', 'Activity log, what is shared, and privacy techniques in use.'],
  ['tune', 'Settings', 'Local epochs, learning rate and total number of rounds.'],
  ['query_stats', 'Predictions', 'Try patient values and see the risk estimated by the global model.'],
]

const TECH = [
  ['Frontend', 'React, JavaScript, Tailwind CSS'],
  ['Learning method', 'Federated Averaging (FedAvg)'],
  ['Local model', 'Logistic regression trained with mini-batch SGD'],
  ['Data', 'Synthetic, non-identical hospital datasets'],
  ['Features', 'Age, BMI, glucose and blood pressure'],
  ['Runs', 'Entirely in the browser, no patient data or server needed'],
]

const FUTURE = [
  ['Built', 'Working prototype with three simulated hospital clients.'],
  ['Built', 'Multiple FedAvg rounds with model performance comparison.'],
  ['Built', 'Dashboard for training status, performance and predictions.'],
  ['Partly', 'Study how different hospital data distributions affect the global model.'],
  ['Planned', 'Secure aggregation and differential privacy.'],
  ['Planned', 'Authorized EHR / API integration for real-world deployment.'],
]

const LITERATURE = [
  ['H. Brendan McMahan', '2017', 'Communication-Efficient Learning of Deep Networks from Decentralized Data', 'Introduced FedAvg.'],
  ['Theodora S. Brisimi', '2018', 'Federated Learning of Predictive Models from Federated Electronic Health Records', 'EHR-based prediction.'],
  ['Nicola Rieke', '2020', 'The Future of Digital Health with Federated Learning', 'Digital-health applications.'],
  ['Micah J. Sheller', '2020', 'Federated Learning in Medicine: Facilitating Multi-Institutional Collaborations Without Sharing Patient Data', 'Multi-institution medical collaboration.'],
  ['Peter Kairouz', '2021', 'Advances and Open Problems in Federated Learning', 'Challenges and open problems.'],
]

const TEAM = ['Aditya Rathod', 'Purushottam Ghatul', 'Shweta Supe', 'Shweta Patil']

const REMEMBER_KEY = 'healthgrid-username'
const readSaved = () => { try { return localStorage.getItem(REMEMBER_KEY) || '' } catch { return '' } }

function LoginModal({ onClose, onLogin }) {
  const saved = readSaved()
  const [user, setUser] = useState(saved)
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)
  const field = 'w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-body-md focus:outline-none focus:border-primary'

  const submit = (e) => {
    e.preventDefault()
    if (!user.trim() || !pass) return
    try {
      if (remember) localStorage.setItem(REMEMBER_KEY, user.trim())
      else localStorage.removeItem(REMEMBER_KEY)
    } catch { /* storage unavailable: skip remembering */ }
    onLogin(user.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 md:px-gutter-desktop" onClick={onClose}>
      <form id="login-form" method="post" action="#" onSubmit={submit} onClick={(e) => e.stopPropagation()} className={`${CARD} w-full max-w-sm flex flex-col gap-space-md border border-outline-variant/30`}>
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">Login</h2>
          <button type="button" onClick={onClose} aria-label="Close"><Icon name="close" className="text-outline hover:text-primary" /></button>
        </div>
        <label htmlFor="username" className="flex flex-col gap-space-xs font-label-caps text-label-caps text-outline uppercase tracking-wider">
          Username
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoFocus={!saved}
            className={field}
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Enter your name"
          />
        </label>
        <label htmlFor="password" className="flex flex-col gap-space-xs font-label-caps text-label-caps text-outline uppercase tracking-wider">
          Password
          <div className="relative">
            <input
              id="password"
              name="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              autoFocus={Boolean(saved)}
              className={`${field} pr-12`}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary">
              <Icon name={show ? 'visibility_off' : 'visibility'} className="text-[20px]" />
            </button>
          </div>
        </label>
        <label className="flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface-variant cursor-pointer">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-[#f2ca50] w-4 h-4" />
          Remember my username on this device
        </label>
        <button type="submit" disabled={!user.trim() || !pass} className="px-space-lg py-space-sm rounded-lg bg-primary text-surface-container-lowest font-semibold disabled:opacity-40">
          Login to Dashboard
        </button>
        <p className="font-telemetry-mono-sm text-telemetry-mono-sm text-outline">Demo login: any username and password works. Your browser or password manager can save and autofill them on any device you sign in to.</p>
      </form>
    </div>
  )
}

export default function Home({ onLogin }) {
  const [open, setOpen] = useState(false)
  const login = () => setOpen(true)
  const [active, setActive] = useState('')
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      let cur = ''
      for (const [id] of NAV) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) cur = id
      }
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('main section:not(:first-child)')
    els.forEach((el) => el.classList.add('reveal'))
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-surface-dim text-on-surface relative overflow-x-hidden">
      <LuxBackground />

      <header className="fixed top-0 inset-x-0 z-40 bg-surface-dim/80 backdrop-blur-xl border-b border-outline-variant/25">
        <div className={`${WRAP} h-20 flex items-center justify-between`}>
          <a href="#top" className="flex items-center gap-space-sm">
            <Icon name="health_and_safety" className="text-primary" />
            <span className="font-display-hero text-headline-md tracking-widest font-light">HEALTHGRID AI</span>
          </a>
          <nav className="hidden md:flex items-center gap-space-xl">
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? 'true' : undefined}
                className={`relative py-space-xs font-body-sm text-body-sm transition-colors hover:text-primary after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:bg-primary after:transition-transform after:duration-300 ${active === id ? 'text-primary after:scale-x-100' : 'text-on-surface-variant after:scale-x-0'}`}
              >{label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-space-sm">
            <div className="hidden sm:block"><ButtonWithIcon size="sm" onClick={login}>Login</ButtonWithIcon></div>
            <button onClick={() => setMenu((m) => !m)} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} className="md:hidden w-10 h-10 rounded-lg border border-outline-variant/40 flex items-center justify-center text-primary">
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
        <div className={`md:hidden fixed inset-0 top-20 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-700 ${menu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMenu(false)} aria-hidden="true" />
        <nav className={`md:hidden fixed right-0 top-20 bottom-0 z-40 w-72 max-w-[85%] bg-surface-dim/95 backdrop-blur-xl border-l border-outline-variant/25 px-6 py-space-md flex flex-col transition-transform duration-700 ease-in-out ${menu ? 'translate-x-0' : 'translate-x-full'}`}>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)} className={`py-space-sm border-b border-outline-variant/15 font-body-md ${active === id ? 'text-primary' : 'text-on-surface-variant'}`}>{label}</a>
          ))}
          <button onClick={() => { setMenu(false); login() }} className="mt-space-md py-space-sm rounded-full bg-primary text-surface-container-lowest font-semibold">Login</button>
        </nav>

      <main id="top" className="relative z-10 pt-20">
        <section className={`${WRAP} pt-20 pb-24 lux-rise grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center`}>
          <div className="lg:col-span-7">
          <p className={`${EYEBROW} mb-space-md`}>KDK College of Engineering, Nagpur • Dept. of AI &amp; Data Science</p>
          <h1 className="font-display-hero text-[clamp(2.6rem,5.2vw,4.8rem)] leading-[1.02] tracking-tight font-light uppercase">
            Smarter healthcare, <span className="lux-shine italic font-normal">without sharing</span> patient data.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-space-lg">
            HealthGrid AI is a privacy-preserving federated learning system. Hospitals train one shared machine learning model together while every patient record stays where it belongs.
          </p>
          <div className="flex flex-wrap items-center gap-space-lg mt-space-xl">
            <ButtonWithIcon onClick={login}>Login to Dashboard</ButtonWithIcon>
            <a href="#about" className="font-body-md text-on-surface-variant hover:text-primary transition-colors underline underline-offset-8 decoration-outline-variant">Learn about the project</a>
          </div>
        </div>
          <div className="lg:col-span-5 max-w-xl mx-auto w-full"><HeroVisual /></div>
        </section>

        <section className={RULE}>
          <dl className={`${WRAP} grid grid-cols-2 md:grid-cols-4 divide-x divide-outline-variant/25`}>
            {STATS.map(([v, l]) => (
              <div key={l} className="py-space-xl px-space-lg first:pl-0">
                <dt className="font-display-hero text-headline-xl text-primary font-light">{v}</dt>
                <dd className="font-telemetry-mono-sm text-telemetry-mono-sm text-outline uppercase tracking-wider mt-space-xs">{l}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="about" className={`${RULE} scroll-mt-20`}>
          <div className={`${WRAP} py-28 grid grid-cols-1 lg:grid-cols-12 gap-space-xl`}>
            <div className="lg:col-span-4">
              <p className={EYEBROW}>About the Project</p>
              <h2 className="font-display-hero text-headline-xl font-light mt-space-sm">The problem we solve</h2>
            </div>
            <div className="lg:col-span-8 flex flex-col gap-space-lg">
              <p className="font-body-lg text-body-lg text-on-surface">
                Healthcare data is spread across many hospitals and holds sensitive patient information. Collecting it in one central database raises privacy, security and data-sharing concerns.
              </p>
              <p className={P}>
                Federated learning turns the process around. Instead of moving data to the model, we move the model to the data. Each hospital trains locally and shares only what the model learned. The result is a stronger model for everyone, built without a single raw record leaving its source.
              </p>
              <p className={P}>
                This academic prototype demonstrates the complete cycle with three simulated hospitals and synthetic healthcare data, with live charts for accuracy, loss and training status.
              </p>
            </div>
          </div>
        </section>

        <section id="objectives" className={`${RULE} scroll-mt-20`}>
          <div className={`${WRAP} py-28`}>
            <p className={EYEBROW}>Objectives</p>
            <h2 className="font-display-hero text-headline-xl font-light mt-space-sm mb-space-xl">What the project sets out to do</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-space-xl">
              {OBJECTIVES.map(([t, d], i) => (
                <li key={t} className="py-space-md border-b border-outline-variant/25 flex gap-space-md">
                  <span className="font-telemetry-mono text-primary">0{i + 1}</span>
                  <div>
                    <h3 className="font-body-lg text-body-lg font-semibold">{t}</h3>
                    <p className={P}>{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="how" className={`${RULE} scroll-mt-20`}>
          <div className={`${WRAP} py-28`}>
            <p className={EYEBROW}>How It Works</p>
            <h2 className="font-display-hero text-headline-xl font-light mt-space-sm mb-space-xl">One round of federated training</h2>
            <ol className="grid grid-cols-1 md:grid-cols-4 gap-space-xl">
              {STEPS.map(([t, d], i) => (
                <li key={t} className="border-t border-primary/60 pt-space-md">
                  <span className="font-telemetry-mono text-primary">0{i + 1}</span>
                  <h3 className="font-headline-md text-headline-md mt-space-xs mb-space-xs">{t}</h3>
                  <p className={P}>{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={RULE}>
          <div className={`${WRAP} py-28 grid grid-cols-1 lg:grid-cols-12 gap-space-xl`}>
            <div className="lg:col-span-4">
              <p className={EYEBROW}>Methodology</p>
              <h2 className="font-display-hero text-headline-xl font-light mt-space-sm">From data to global model</h2>
            </div>
            <ol className="lg:col-span-8 divide-y divide-outline-variant/25">
              {METHOD.map(([t, d], i) => (
                <li key={t} className="py-space-md first:pt-0 flex gap-space-md">
                  <span className="font-telemetry-mono text-primary w-6 shrink-0">{i + 1}.</span>
                  <p className={P}><span className="text-on-surface font-semibold">{t}. </span>{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="dashboard" className={`${RULE} scroll-mt-20`}>
          <div className={`${WRAP} py-28`}>
            <p className={EYEBROW}>The Dashboard</p>
            <h2 className="font-display-hero text-headline-xl font-light mt-space-sm mb-space-xl">What you get after login</h2>
            <div className="max-w-6xl mx-auto mb-space-xl"><DashPreview /></div>
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-space-xl gap-y-space-xl">
              {DASH.map(([icon, t, d]) => (
                <li key={t}>
                  <Icon name={icon} className="text-primary" />
                  <h3 className="font-body-lg text-body-lg font-semibold mt-space-xs">{t}</h3>
                  <p className={P}>{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={RULE}>
          <div className={`${WRAP} py-28 grid grid-cols-1 lg:grid-cols-12 gap-space-xl`}>
            <div className="lg:col-span-4">
              <p className={EYEBROW}>Technology</p>
              <h2 className="font-display-hero text-headline-xl font-light mt-space-sm">How it is built</h2>
            </div>
            <dl className="lg:col-span-8 divide-y divide-outline-variant/25">
              {TECH.map(([k, v]) => (
                <div key={k} className="py-space-md first:pt-0 flex flex-col md:flex-row md:gap-space-xl">
                  <dt className="md:w-56 shrink-0 font-telemetry-mono-sm text-telemetry-mono-sm text-outline uppercase tracking-wider">{k}</dt>
                  <dd className="font-body-md text-body-md text-on-surface">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="privacy" className={`${RULE} scroll-mt-20`}>
          <div className={`${WRAP} py-28 grid grid-cols-1 lg:grid-cols-12 gap-space-xl`}>
            <div className="lg:col-span-4">
              <p className={EYEBROW}>Privacy</p>
              <h2 className="font-display-hero text-headline-xl font-light mt-space-sm">Built around trust</h2>
            </div>
            <ul className="lg:col-span-8 divide-y divide-outline-variant/25">
              {PRIVACY.map(([t, d]) => (
                <li key={t} className="py-space-md first:pt-0 flex flex-col md:flex-row md:gap-space-xl">
                  <h3 className="md:w-56 shrink-0 font-body-lg text-body-lg font-semibold">{t}</h3>
                  <p className={P}>{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="research" className={`${RULE} scroll-mt-20`}>
          <div className={`${WRAP} py-28 grid grid-cols-1 lg:grid-cols-12 gap-space-xl`}>
            <div className="lg:col-span-4">
              <p className={EYEBROW}>Roadmap</p>
              <h2 className="font-display-hero text-headline-xl font-light mt-space-sm">Where the project stands</h2>
            </div>
            <ul className="lg:col-span-8 divide-y divide-outline-variant/25">
              {FUTURE.map(([s, t]) => (
                <li key={t} className="py-space-md first:pt-0 flex items-start justify-between gap-space-md">
                  <span className={P}>{t}</span>
                  <span className={`font-telemetry-mono-sm text-telemetry-mono-sm uppercase tracking-wider whitespace-nowrap ${s === 'Planned' ? 'text-outline' : s === 'Partly' ? 'text-primary' : 'text-tertiary'}`}>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${WRAP} pb-28 grid grid-cols-1 lg:grid-cols-12 gap-space-xl`}>
            <div className="lg:col-span-4">
              <p className={EYEBROW}>Literature Survey</p>
              <h2 className="font-display-hero text-headline-xl font-light mt-space-sm">Research we build on</h2>
            </div>
            <ul className="lg:col-span-8 divide-y divide-outline-variant/25">
              {LITERATURE.map(([a, y, t, n]) => (
                <li key={t} className="py-space-md first:pt-0">
                  <p className="font-body-md text-body-md text-on-surface">{t}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">{a} ({y}) — {n}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="team" className={`${RULE} scroll-mt-20`}>
          <div className={`${WRAP} py-28 grid grid-cols-1 lg:grid-cols-12 gap-space-xl`}>
            <div className="lg:col-span-4">
              <p className={EYEBROW}>About Us</p>
              <h2 className="font-display-hero text-headline-xl font-light mt-space-sm">The team</h2>
              <p className={`${P} mt-space-md`}>First Project Title Seminar, KDK College of Engineering, Nagpur.</p>
            </div>
            <div className="lg:col-span-8">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-space-xl">
                {TEAM.map((n) => (
                  <li key={n} className="py-space-md border-b border-outline-variant/25 font-body-lg text-body-lg">{n}</li>
                ))}
              </ul>
              <p className="mt-space-lg font-telemetry-mono-sm text-telemetry-mono-sm text-outline uppercase tracking-wider">Project Guide</p>
              <p className="font-body-lg text-body-lg text-primary">Prof. Kartik Ingole</p>
            </div>
          </div>
        </section>

        <section className={`${RULE} bg-surface-container-lowest/50`}>
          <div className={`${WRAP} py-24 flex flex-col md:flex-row md:items-center justify-between gap-space-lg`}>
            <h2 className="font-display-hero text-headline-xl font-light max-w-xl">See federated learning running live.</h2>
            <ButtonWithIcon onClick={login}>Login to Dashboard</ButtonWithIcon>
          </div>
        </section>
      </main>

      <footer className={RULE}>
        <div className={`${WRAP} py-space-lg flex flex-col md:flex-row justify-between gap-space-xs font-telemetry-mono-sm text-telemetry-mono-sm text-outline`}>
          <span>© HealthGrid AI • Academic prototype</span>
          <span>KDK College of Engineering, Nagpur</span>
        </div>
      </footer>

      {open && <LoginModal onClose={() => setOpen(false)} onLogin={onLogin} />}
    </div>
  )
}
