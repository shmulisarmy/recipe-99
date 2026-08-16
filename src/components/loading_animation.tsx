export function LoadingAnimation() {
    return <div class="loading-container" style={{
      display: "flex",
      "flex-direction": "column",
      "align-items": "center",
      "justify-content": "center",
      "min-height": "15rem",
    }}>
      <div class="spinner" style={{
        width: "3rem",
        height: "3rem",
        "border": "0.5rem solid #ececec",
        "border-top": "0.5rem solid #4287f5",
        "border-radius": "50%",
        animation: "spin 1s linear infinite"
      }} />
      <span style={{ "margin-top": "1.5rem", color: "#555", "font-size": "1.15rem" }}>
        Extracting ingredients from your image...
      </span>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  }