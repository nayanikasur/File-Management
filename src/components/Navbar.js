import styled from "styled-components";
import { Link } from "react-router-dom";

const LogoutButton = styled.button`
  position: absolute;
  top: 10px; 
  right: 10px; 
  background: #007bff;
  color: white;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  border: none;
  font-size: 16px;
  transition: background-color 0.3s;
  
  &:hover {
    background: #0056b3;
  }
`;

const Navbar = ({ user, logOut }) => {
    console.log(user);
    return (
        <>
            {user ? (
                <Link to="/"><LogoutButton onClick={logOut}>Log Out</LogoutButton></Link>
            ) : (
                <LogoutButton >Log In</LogoutButton>
            )}
            <br /> <br />
            {/* <hr /> */}
        </>
    );
};
export default Navbar;