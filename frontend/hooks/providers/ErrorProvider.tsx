import { createContext, ReactNode, useContext, useState } from "react";
import Errors from "@/components/Errors";
import { ErrorsContextType } from "@/type/feature/errors/errors_context";

const defaultContextValue: ErrorsContextType = {
    setErrorVisible: () => {},
    setErrorMessage: () => {},
};
const ERROR_CONTEXT = createContext(defaultContextValue);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
    return (
        <ERROR_CONTEXT.Provider
            value={{
                setErrorVisible,
                setErrorMessage
            }}
        >
            {children}
        <Errors
            visible={errorVisible}
            onClose={() => setErrorVisible(false)}
            errorMessage={errorMessage} />
        </ERROR_CONTEXT.Provider>
    );
};

export const useErrors = () => {
    const context = useContext(ERROR_CONTEXT);
    if (!context) {
      throw new Error("useErrors must be used within a ErrorProvider");
    }
    return context;
  };
  