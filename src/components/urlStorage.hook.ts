import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

/**
 * Custom hook for storing and sharing data through url
 * Payload is appended to the end of the url which can be shared with others.
 * Upon initialization, it reconstitutes the payload from the url, if present
 *
 * @param {T} payload
 * @param setPayload
 * @param customDeserializer
 * @template T - payload type
 */
export const useUrlStorage = <T>(
  payload: T,
  setPayload: Dispatch<SetStateAction<T>>,
  customDeserializer?: (value: string) => T
) => {
  // This is used to ignore initial serialization
  const initialSerialization = useRef(true);
  
  // base 64 encoded json str of the payload
  const [serializedPayload, setSerializedPayload] = useState<string>();

  const navigate = useNavigate();
  const { urlData } = useParams<any>();

  //#region effects
  useEffect(() => {
    setSerializedPayload(urlData);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!initialSerialization.current) {
      // skip the initial serialization to allow payload to be constituted from the url (if any)
      serializePayload<T>(payload, navigate, setSerializedPayload);
    } else initialSerialization.current = false;
    // eslint-disable-next-line
  }, [payload]);

  useEffect(() => {
    deserializeChallenge<T>(serializedPayload, setPayload, customDeserializer);
    // eslint-disable-next-line
  }, [serializedPayload]);
  //#endregion
};

/**
 * Deserializes base64 encoded json string into T type of object
 *
 * @param {string | undefined} serializedPayload - serialized string (base64 encoded)
 * @param {Dispatch<SetStateAction<T>>} setPayload - payload setter function
 * @param {(value: string) => T} customDeserializer - custom deserializer. Input is a json string. Must return T type of object
 * @template T - payload type
 */
const deserializeChallenge = <T>(
  serializedPayload: string | undefined,
  setPayload: Dispatch<SetStateAction<T>>,
  customDeserializer?: (value: string) => T
) => {
  if (serializedPayload) {
    const jsonStr = atob(serializedPayload);
    const deserializedPayload = customDeserializer ? customDeserializer(jsonStr) : (JSON.parse(jsonStr) as T);

    // update the payload
    setPayload(deserializedPayload);
  }
};

/**
 * Serializes given object of type T to a base64 string which will be appended at the end of the url.
 * (object -> json -> base64 string)
 *
 * @param {T} payload - main object that needs to be serialized into a b64
 * @param {NavigateFunction} navigate - navigate method from react-router.
 * @param {Dispatch<SetStateAction<string | undefined>>} setSerializedPayload - setter for serialized payload. This will store the payload in local state
 * @template T - payload type
 */
const serializePayload = <T>(
  payload: T,
  navigate: NavigateFunction,
  setSerializedPayload: Dispatch<SetStateAction<string | undefined>>
) => {
  if (payload) {
    const payloadB = btoa(JSON.stringify(payload));
    setSerializedPayload(payloadB);

    // dynamically update the url
    navigate(`/${payloadB}`);
  }
};
