interface IRoute {
  path?: string;
  icon?: string;
  name: string;
  routes?: IRoute[];
  checkActive?(pathname: String, route: IRoute): boolean;
  exact?: boolean;
  roles?: string[];
}

export function routeIsActive(pathname: String, route: IRoute): boolean {
  if (route.checkActive) {
    return route.checkActive(pathname, route);
  }

  return route?.exact
    ? pathname == route?.path
    : route?.path
    ? pathname.indexOf(route.path) === 0
    : false;
}

const routes: IRoute[] = [
  // Rute yang hanya bisa diakses oleh Super Admin
  {
    path: "/superadmin/dashboard",
    icon: "HomeIcon",
    name: "Dashboard",
    exact: true,
    roles: ["super_admin"],
  },
  {
    path: "/superadmin/rekaptulasi",
    icon: "ButtonsIcon",
    name: "Rekaptulasi",
    roles: ["super_admin"],
  },
  {
    path: "/superadmin/perencanaan",
    icon: "ChartsIcon",
    name: "Perencanaan Anggaran",
    roles: ["super_admin"],
  },
  {
    path: "/superadmin/m-user",
    icon: "FormsIcon",
    name: "Manajemen User",
    roles: ["super_admin"],
  },
  {
    path: "/superadmin/m-cabang",
    icon: "CardsIcon",
    name: "Manajemen Cabang",
    roles: ["super_admin"],
  },
  {
    path: "/superadmin/kategori",
    icon: "ModalsIcon", // Bisa ganti sesuai kebutuhan
    name: "Manajemen Kategori",
    roles: ["super_admin"],
  },

  // Rute yang hanya bisa diakses oleh admin
  {
    path: "/admin/dashboard",
    icon: "HomeIcon",
    name: "Dashboard Admin",
    exact: true,
    roles: ["admin"],
  },
  {
    path: "/admin/transaksi",
    icon: "TablesIcon",
    name: "Transaksi",
    roles: ["admin"],
  },
  {
    path: "/admin/perencanaan",
    icon: "ChartsIcon",
    name: "Perencanaan Anggaran",
    roles: ["admin"],
  },
  {
    path: "/admin/pos",
    icon: "PagesIcon",
    name: "POS",
    roles: ["admin"],
  },
  {
    path: "/admin/rekaptulasi",
    icon: "ButtonsIcon",
    name: "Rekaptulasi",
    roles: ["admin"],
  },
];

// Fungsi untuk memfilter rute berdasarkan role pengguna
export const filterRoutesByRole = (
  routes: IRoute[],
  role: string
): IRoute[] => {
  return routes
    .filter((route) => {
      if (route.roles) {
        return route.roles.includes(role);
      }
      return true;
    })
    .map((route) => {
      if (route.routes) {
        const filteredSubRoutes = filterRoutesByRole(route.routes, role);
        return { ...route, routes: filteredSubRoutes };
      }
      return route;
    });
};

export type { IRoute };
export default routes;
