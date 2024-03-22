import doxLogo from "./assets/doxlogo2.png";

export default function Logo() {
  return (
    <div className="logo">
      <img
        src={doxLogo}
        alt="A dachshund wearing 3d glasses with popcorn in front of it"
      />
      <h1>
        <span className="blue">Wiener</span>
        <span className="red">Watch</span>
      </h1>
    </div>
  );
}
