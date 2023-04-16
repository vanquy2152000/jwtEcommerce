export interface IRouter {
    path?: string;
    element?: JSX.Element;
    errorElement?: JSX.Element;
    loader?: IRootLoader;
    children?: IChildRouter[];
}

export interface IChildRouter {
    path?: string;
    element?: JSX.Element;
}

export interface IRootLoader {
    // Define RootLoader properties
}