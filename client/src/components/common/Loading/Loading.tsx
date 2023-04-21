import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
    return (
        <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
        }}>
            <HashLoader color="#ea4c89" />
            <div style={{ marginTop: "10px", color: "#ea4c89" }}>Loading ...</div>
        </div>
    )
}

export default Loading