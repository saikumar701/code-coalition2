import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GitHubCorner from "./components/GitHubCorner";
import Toast from "./components/toast/Toast";
import { OutputProvider } from "./context/OutputContext";
import DrawingBoard from "./pages/DrawingBoard";
import EditorPage from "./pages/EditorPage";
import HomePage from "./pages/HomePage";

const App = () => {
    return (
        <OutputProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/editor/:roomId" element={<EditorPage />} />
                    <Route path="/drawing" element={<DrawingBoard />} />
                </Routes>
            </Router>
            <Toast /> {/* Toast component from react-hot-toast */}
            <GitHubCorner />
        </OutputProvider>
    );
};

export default App;