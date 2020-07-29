import { Location } from './location';
import { RouteInterface } from './routeInterface';

export interface Router {
    getCurrentLocation: Function
    listenBefore(listener: any): any,
    listen(listener: any): any,
    transitionTo(nextLocatiobn: any): any,
    push(input: any): any,
    replace(input: any): any,
    go(n: any): any,
    goBack: Function
    goForward: Function
    createKey: Function
    createPath(location: any): any,
    createHref(path: any)
    createLocation(location: any, action: any): any,
    unsubscribe: Function
    setRouteLeaveHook(route: any, hook: any): any,
    isActive(location:any, indexOnly:any):any
    location: Location,
    params: {
        diagnosticID: string
    }
    routes: RouteInterface[],
}