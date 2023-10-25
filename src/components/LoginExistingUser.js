import styled from "styled-components";
import { auth } from "../firebaseInit";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const StyledSignin = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10%;
  position: relative; /* Add this line */
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  padding: 2%;
  width: 80%;
  max-width: 400px;
  background-color: #f7f7f7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 10px;

  @media (max-width: 768px) {
    width: 90%;
  }

  @media (max-width: 576px) {
    width: 95%;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #007bff;
`;

const Input = styled.input`
  margin-top: 10px;
  border-radius: 5px;
  padding: 10px;
  width: 85%;
  background-color: #fff;
  border: 1px solid ${(props) => (props.isWrongPassword ? 'red' : '#ccc')};
  // Rest of your styles
`;

const Button = styled.button`
  margin-top: 20px;
  background: #007bff;
  color: white;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  border: none;
  width: 50%;
  font-size: 16px;
  transition: background-color 0.3s; 

  &:hover {
    background: #0056b3; 
  }
`;


export const LoginExistingUser = (props) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checkAuth, setCheckAuth] = useState(!!auth.currentUser);

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const signIn = async () => {
        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setEmail("");
            setPassword("");
            props.setUser(true);
            navigate("/dandu");
        } catch (error) {
            alert("User doesnt exist Sign up")
            console.log("Login error:", error);
        }
    };

    return (
        <>
            <StyledSignin>
                <FormContainer onSubmit={handleSubmit}>
                    <Title>SIGN-IN</Title>
                    <Input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="youremail@email.com"
                        value={email}
                    />
                    <Input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="password"
                        value={password}
                    />
                    <Button onClick={signIn}>Login</Button>
                    <p>Don't have an account? <Link to="/Signup">Sign-up</Link></p>
                </FormContainer>
            </StyledSignin>
        </>
    )
}