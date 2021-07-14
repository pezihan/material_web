export default function({isHMR, app, store, route, params, error, redirect}){
    if (isHMR) return
    if (route.fullPath == '/'){
        return redirect('/home')
    }
}