const Card = (props) => {
  return (
    <div
      style={{
        padding: "1rem",
        margin: "1rem",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "6px",
        backgroundColor: "white",
      }}
    >
      {props.children}
    </div>
  );
};

export default Card;
