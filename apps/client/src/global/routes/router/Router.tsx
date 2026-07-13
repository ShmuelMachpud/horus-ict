import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"

const App = lazy(() => import('@/App'))

const Router = () =>{
    return (
        <Routes>
            <Route path="/app" element={
                <Suspense>
                    <App/>
                </Suspense>
            }/>
        </Routes>
    )
}

export default Router