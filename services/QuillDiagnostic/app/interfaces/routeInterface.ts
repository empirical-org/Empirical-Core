export interface RouteInterface {
    childRoutes?: {
        childRoutes?: any,
        getChildRoutes?(partialNextState: any, cb: Function): any,
        getComponent?(nextState: any, cb: Function): any,
    }[],
    getComponent?(nextState: any, cb: Function): any,
    indexRoute?: {
        component: Function,
        onEnter: Function
    },
    path: string
}