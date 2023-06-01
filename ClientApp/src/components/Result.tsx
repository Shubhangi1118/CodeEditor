import React, { useEffect, useState } from "react";
import axios from "axios";

type Participant = {
    _id: string;
    name: string;
};

type Result = {
    _id: string;
    participantId: string;
    outputs: Array<number>;
};

const Result: React.FC = () => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [results, setResults] = useState<Result[]>([]);

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
            {participants.length > 0 ? (
                participants.map((participant) => {
                    const participantResults = results.filter((result) => result.participantId === participant._id);
                    return (
                        <div key={participant._id}>
                            <h2>Participant: {participant.name}</h2>
                            {participantResults.length > 0 ? (
                                <div>
                                    <h3>Results:</h3>
                                    {participantResults.map((result) => (
                                        <div key={result._id}>
                                            <h4>Result ID: {result._id}</h4>
                                            <ul>
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
                        </div>
                    );
                })
            ) : (
                <p>No participants found.</p>
            )}
        </div>
    );
};

export default Result;
