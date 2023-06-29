//importing the libraries
import React, { useEffect, useState } from "react";
import axios from "axios";

type Participant = {
    _id: string;// _id of participant
    name: string;//name of Participant
};

type Result = {
    _id: string;//_id of Result
    questionNumber: number;//the questionNumber for which the result has been stored
    participantId: string;// participantId of the participant who anaswered the question
    outputs: Array<number>;//the result of the question answered by participant
};

const Result: React.FC = () => {
    const [participants, setParticipants] = useState<Participant[]>([]);//variable for storing the array of participant
    const [results, setResults] = useState<Result[]>([]);//variable for storing the array of results

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all participants
                const participantsResponse = await axios.get("/api/Participant");
                const participantsData = participantsResponse.data;
                setParticipants(participantsData);

                // Fetch results for each participant
                const participantsIds = participantsData.map((participant:Participant) => participant._id);
                const resultsResponse = await axios.get(`/api/Compiler?participantIds=${participantsIds.join(",")}`);
                setResults(resultsResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {/*checking if there is atleast one participant*/}
            {participants.length > 0 ? (
                participants.map((participant) => {
                    {/*Going through the array of participants */}
                    const participantResults = results.filter((result) => result.participantId === participant._id);
                    return (
                        <div key={participant._id}>
                            {/*displaying the name of every participant*/ }
                            <h4>Participant: {participant.name}</h4>
                            {participantResults.length > 0 ? (
                                <div>
                                    <h4>Results:</h4>
                                    {/*Going through each submission made by the participant*/ }
                                    {participantResults.map((result) => (
                                        <div key={result._id}>
                                            <h4>Question No.: {result.questionNumber}</h4>
                                            <ul>
                                                {/*Printing Test Case passed if output is same as expected ouput otherwise printing Test case Failed for each test case*/ }
                                                {result.outputs.map((output, index) => (
                                                    <li key={index}>
                                                        {output === 1 ? "Test case passed" : "Test case failed"}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                    ))}
                                </div>
                            ) : (
                                    <p>No results found for this participant.</p>
                            )}
                            {/*If teh participant hasn't subitted code for any question  printing No results found for this participant*/}
                        </div>
                    );
                })
            ) : (
                <p>No participants found.</p>
            )}
            {/*If the array of participants is empty the printing No participnats found*/ }
        </div>
    );
};

export default Result;
