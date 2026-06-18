const VOICE_AGENT_BASE_URL = import.meta.env.VITE_VOICE_AGENT_BASE_URL || 'http://localhost:3003';

const parseVoiceAgentError = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return data.detail || data.message || 'Voice agent token request failed';
    }

    return await response.text();
  } catch {
    return 'Voice agent token request failed';
  }
};

export const requestVoiceCallToken = async ({ phoneNumber, name, context }) => {
  const response = await fetch(`${VOICE_AGENT_BASE_URL}/api/v1/calls/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone_number: phoneNumber,
      name,
      ...(context && { context }),
    }),
  });

  if (!response.ok) {
    throw new Error(await parseVoiceAgentError(response));
  }

  return response.json();
};

export default VOICE_AGENT_BASE_URL;
