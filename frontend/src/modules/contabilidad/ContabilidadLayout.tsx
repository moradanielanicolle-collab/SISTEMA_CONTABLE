import { BarChart3, FilePlus2, ListOrdered, Scale } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const contabilidadNavItems = [
  {
    to: '/asientos',
    label: 'Libro Diario',
    icon: ListOrdered,
  },
  {
    to: '/asientos/nuevo',
    label: 'Nuevo Asiento',
    icon: FilePlus2,
  },
];

const reportesNavItems = [
  {
    to: '/reportes/libro-mayor',
    label: 'Libro Mayor',
    icon: BarChart3,
  },
  {
    to: '/reportes/balance-comprobacion',
    label: 'Balance de Comprobación',
    icon: Scale,
  },
  {
    to: '/reportes/estado-resultados',
    label: 'Estado de Resultados',
    icon: BarChart3,
  },
  {
    to: '/reportes/estado-situacion-financiera',
    label: 'Estado de Situación Financiera',
    icon: Scale,
  },
];

export function ContabilidadLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-gradient-to-r from-violet-950 via-violet-800 to-purple-600 text-white shadow-[0_18px_42px_rgba(91,33,182,0.30)]">
        <div className="mx-auto flex min-h-[70px] max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
          <Link to="/asientos" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl font-black shadow-inner ring-1 ring-white/30">
              C
            </span>
            <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
              <span className="text-xl font-black tracking-wide">CONTABLE</span>
              <span className="hidden h-6 w-px bg-white/35 sm:block" />
              <span className="text-sm font-medium text-violet-100">Operación Contable</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            {contabilidadNavItems.map((item) => (
              <TopNavigationLink key={item.to} {...item} />
            ))}
          </nav>
        </div>
        <nav className="bg-violet-950/45">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-4 sm:px-6 lg:px-8">
            <span className="mr-2 py-3 text-[11px] font-semibold uppercase tracking-wide text-violet-200">Informes</span>
            {reportesNavItems.map((item) => (
              <ReportNavigationLink key={item.to} {...item} />
            ))}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

function TopNavigationLink({ to, label, icon: Icon }: (typeof contabilidadNavItems)[number]) {
  return (
    <NavLink
      to={to}
      end={to === '/asientos'}
      className={({ isActive }) =>
        [
          'erp-secondary-button',
          isActive ? 'bg-violet-50 text-violet-950 ring-2 ring-white/40' : '',
        ].join(' ')
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}

function ReportNavigationLink({ to, label, icon: Icon }: (typeof reportesNavItems)[number]) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'inline-flex items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold text-white/90 transition hover:bg-white/10 hover:text-white',
          isActive ? 'border-white bg-white/10 text-white' : 'border-transparent',
        ].join(' ')
      }
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </NavLink>
  );
}
