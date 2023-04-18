import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
    return (
        <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
        }}>
            <HashLoader color="#36d7b7" />
            <div style={{ marginTop: "10px", color: "#36d7b7" }}>Loading ...</div>
        </div>
    )
}

export default Loading