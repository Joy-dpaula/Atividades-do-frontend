import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer/footer";

export function Layout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )

}