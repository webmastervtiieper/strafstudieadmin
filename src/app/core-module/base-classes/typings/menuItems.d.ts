

export interface IRouteMenuItem {
  appId:string;
  id: string;
  icon: string;
  route: string;
  title: string;
  subRouteMenus: IRouteMenuItem[]
}

