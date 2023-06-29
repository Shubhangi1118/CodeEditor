//import the libraries
import React from "react";
import {useHistory } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
export { };

function Participant() {
    // the variables are defined and initialised
    const history = useHistory();// variable using the useHistory hook
    const [isFormValid, setIsFormValid] = React.useState<boolean>(false);// variable for checking if all the form fields are filled or not
    const [_id, setId] = React.useState<string>("");// variable for storing Participant id
    const [name, setName] = React.useState<string>("");// variable for storing Participant's name
    const [email, setEmail] = React.useState<string>("");//variable for storing Participant's email
    const [college, setCollege] = React.useState<string>("");//variable for storing Participant's college name
    // function to check if the form fields are filled or not
    const handleInputChange = () => {
        const isValid = name !== "" && email !== "" && college !== "";
        setIsFormValid(isValid);
    };
    //function to store Participant's data in the database
    async function save(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        try {//sending the participant data to the database
            const response: AxiosResponse = await axios.post("https://localhost:44322/api/Participant/", {
                _id: "",
                Name: name,
                Email: email,
                College: college
            });
            const participantId = response.data._id; //getting the _id corresponding to the participant data
            alert("Information Added Successfully");
            //setting all variables to the initial value
            setId("");
            setName("");
            setEmail("");
            setCollege("");
            history.push(`/Questions/${participantId}`); // Navigate to the Questions page with the participant ID
        } catch (err) { 
            alert(err);//showing the error if the participant data is not added in the database
        }
    }
    return (
        <div>
            <h1>Participant Details</h1>
            <div className="container mt-4">
                <form>
                    <div className="form-group">
                        {/*setting the _id field of the participant form as hidden*/}
                        <input
                            type="text"
                            className="form-control"
                            id="_id"
                            hidden
                            value={_id}
                            onChange={(event) => {
                                setId(event.target.value);
                            }}
                        />
                        {/*setting the Name field of the participant form as required */} 
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Name"
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                                handleInputChange(); // Call the handler
                            }}
                            required
                        />
                    </div>
                    {/*setting the email field of participant form as required*/}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                handleInputChange(); // Call the handler
                            }}
                            required
                        />
                    </div>
                    {/*setting the ccollege field of participant form as required*/ }
                    <div className="form-group">
                        <label>College</label>
                        <input
                            type="text"
                            className="form-control"
                            id="College"
                            value={college}
                            onChange={(event) => {
                                setCollege(event.target.value);
                                handleInputChange(); // Call the handler
                            }}
                            required
                        />
                    </div>
                    <div>
                        {/*The button is disabled unless all the fields of the form are filled */ }
                        <button className="btn btn-primary mt-4" onClick={save} disabled={!isFormValid}>
                            Submit
                        </button>
                    </div> 
                </form>
            </div>
            <br></br>
        </div>
    );
}
export default Participant;
