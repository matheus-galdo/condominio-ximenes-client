import Content from "./Content";

export default function Container(params) {

    return (
        <div className="app-main-container">
            {/* <TheSidebar/> */}
            {/* <TheHeader/> */}
            <div className="content-wrapper">
                <Content />
            </div>
        </div>
    )
}