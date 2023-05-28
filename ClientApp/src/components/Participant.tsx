
import React from "react";
import { Link, useHistory } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
export { };
type _Participant = {
    _id: string;
    name: string;
    email: string;
    college: string;
};

function Participant() {
    const history = useHistory();
    const [isFormValid, setIsFormValid] = React.useState<boolean>(false);
    const [_id, setId] = React.useState<string>("");
    const [name, setName] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const [college, setCollege] = React.useState<string>("");
    const [Participants, setParticipants] = React.useState<Array<_Participant>>([]);

    React.useEffect(() => {
        (async () => await Load())();
    }, []);
    async function Load() {

        const result = await axios.get("https://localhost:44322/api/Participant");
        setParticipants(result.data);
        
    }
    const handleInputChange = () => {
        const isValid = name !== "" && email !== "" && college !== "";
        setIsFormValid(isValid);
    };

    async function save(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        try {
            const response: AxiosResponse = await axios.post("https://localhost:44322/api/Participant/", {
                _id: "",
                Name: name,
                Email: email,
                College: college
            });
            const participantId = response.data._id; 
            alert("Inforrmation Added Successfully");
            setId("");
            setName("");
            setEmail("");
            setCollege("");

            history.push(`/Questions/${participantId}`); // Navigate to the Questions page with the participant ID
        } catch (err) {
            alert(err);
        }
    }



    return (
        <div>
            <h1>Participant Details</h1>
            <div className="container mt-4">
                <form>
                    <div className="form-group">

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

                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Nmae"
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                                handleInputChange(); // Call the handler
                            }}

                            required
                        />
                    </div>

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
                        <button className="btn btn-primary mt-4" onClick={save} disabled={!isFormValid}>
                            Add
                        </button>
                    </div> 
                </form>
            </div>
            <br></br>


        </div>
    );

}
export default Participant;
