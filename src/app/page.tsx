type WaitTime = number | null;

type WaitingTime = {
  id: string;
  time: WaitTime;
};

type Attraction = {
  id: number;
  attributes: {
    name: string;
    FTPName: string;
    openingTime: string;
    closed: boolean;
    closedReason: string | null;
  };
};

type Attractions = {
  data: Attraction[];
  meta: {
    total: number;
  };
};

async function getWaitingTimes() {
  const res = await fetch(
    "https://s05y9cqvq5.execute-api.eu-west-1.amazonaws.com/default/getWaitingTimes",
    { next: { revalidate: 10 } }
  );
  return (await res.json()) as WaitingTime[];
}

async function getAttractions() {
  const res = await fetch(
    "https://api.qa.env.mobile.portaventuraworld.com/api/attractions?locale=en&pagination%5Blimit%5D=10000"
  );
  return (await res.json()) as Attractions;
}

function waitTimeText(time: WaitTime) {
  if (time === null) {
    return "?";
  }

  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  const minutesString = `${minutes}`.padStart(2, "0");

  return `${hours}:${minutesString}`;
}

export default async function Home() {
  const waitTimesData = getWaitingTimes();
  const attractionsData = getAttractions();

  const [waitTimes, attractions] = await Promise.all([
    waitTimesData,
    attractionsData,
  ]);

  const waitingTimesPopulated = waitTimes.map((waitTime) => {
    const attraction = attractions.data.find(
      (attraction) => attraction.attributes.FTPName === waitTime.id
    );
    return {
      ...waitTime,
      attraction,
    };
  });

  // Sort by name
  const waitingTimesSorted = waitingTimesPopulated.sort((a, b) => {
    if (!a.attraction || !b.attraction) {
      return 0;
    }
    if (a.attraction.attributes.name < b.attraction.attributes.name) {
      return -1;
    }
    if (a.attraction.attributes.name > b.attraction.attributes.name) {
      return 1;
    }
    return 0;
  });

  return (
    <main className="px-5 py-4">
      <h1 className="text-4xl mb-6">PortAventura Park Waiting Times</h1>
      <ul>
        {waitingTimesSorted.map((waitTime) => {
          return (
            <li key={waitTime.id}>
              <strong>{waitTime.attraction?.attributes.name}:</strong>{" "}
              {waitTime.time === null ? "?" : waitTimeText(waitTime.time)}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
