import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

export const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.card_light}40 0%,
    ${({ theme }) => theme.card_light}60 50%,
    ${({ theme }) => theme.card_light}40 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: ${({ radius }) => radius || "8px"};
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "20px"};
  margin: ${({ margin }) => margin || "0"};
`;

export const SkeletonText = styled(SkeletonBase)`
  height: ${({ size }) => {
    switch (size) {
      case "h1":
        return "48px";
      case "h2":
        return "36px";
      case "h3":
        return "28px";
      case "body":
        return "16px";
      default:
        return "20px";
    }
  }};
  margin-bottom: 12px;
`;

export const SkeletonCircle = styled(SkeletonBase)`
  border-radius: 50%;
  width: ${({ size }) => size || "100px"};
  height: ${({ size }) => size || "100px"};
`;

export const SkeletonCard = styled.div`
  background: ${({ theme }) => theme.card_light}50;
  border: 1px solid ${({ theme }) => theme.primary}15;
  border-radius: 16px;
  padding: ${({ padding }) => padding || "24px"};
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "auto"};
`;

export const SkeletonButton = styled(SkeletonBase)`
  height: 48px;
  width: ${({ width }) => width || "150px"};
  border-radius: 12px;
`;

// Specific skeleton components for different sections
export const HeroSkeleton = () => (
  <div style={{ padding: "60px 20px", maxWidth: "1200px", margin: "0 auto" }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "center" }}>
      <div>
        <SkeletonText size="h1" width="80%" />
        <SkeletonText size="h2" width="60%" margin="20px 0" />
        <SkeletonText size="body" width="100%" />
        <SkeletonText size="body" width="90%" />
        <SkeletonText size="body" width="95%" />
        <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
          <SkeletonButton width="160px" />
          <SkeletonButton width="140px" />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <SkeletonCircle size="400px" />
      </div>
    </div>
  </div>
);

export const SkillsSkeleton = () => (
  <div style={{ padding: "60px 20px", maxWidth: "1100px", margin: "0 auto" }}>
    <SkeletonText size="h2" width="200px" margin="0 auto 40px" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
      {[1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i} height="200px">
          <SkeletonText size="h3" width="60%" margin="0 auto 24px" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {[1, 2, 3, 4, 5].map((j) => (
              <SkeletonBase key={j} width="80px" height="36px" radius="50px" />
            ))}
          </div>
        </SkeletonCard>
      ))}
    </div>
  </div>
);

export const ProjectsSkeleton = () => (
  <div style={{ padding: "60px 20px", maxWidth: "1350px", margin: "0 auto" }}>
    <SkeletonText size="h2" width="200px" margin="0 auto 40px" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "32px" }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonCard key={i} height="400px">
          <SkeletonBase height="200px" margin="0 0 16px 0" radius="12px" />
          <SkeletonText size="h3" width="80%" />
          <SkeletonText size="body" width="100%" />
          <SkeletonText size="body" width="90%" />
          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <SkeletonBase width="60px" height="28px" radius="50px" />
            <SkeletonBase width="70px" height="28px" radius="50px" />
            <SkeletonBase width="65px" height="28px" radius="50px" />
          </div>
        </SkeletonCard>
      ))}
    </div>
  </div>
);

export const TimelineSkeleton = () => (
  <div style={{ padding: "60px 20px", maxWidth: "1000px", margin: "0 auto" }}>
    <SkeletonText size="h2" width="200px" margin="0 auto 60px" />
    {[1, 2, 3].map((i) => (
      <div key={i} style={{ marginBottom: "40px", position: "relative", paddingLeft: "60px" }}>
        <SkeletonCircle size="40px" style={{ position: "absolute", left: "0", top: "0" }} />
        <SkeletonCard height="200px">
          <SkeletonText size="h3" width="70%" />
          <SkeletonText size="body" width="50%" margin="8px 0 16px" />
          <SkeletonText size="body" width="100%" />
          <SkeletonText size="body" width="95%" />
          <SkeletonText size="body" width="90%" />
        </SkeletonCard>
      </div>
    ))}
  </div>
);

export const ContactSkeleton = () => (
  <div style={{ padding: "60px 20px", maxWidth: "600px", margin: "0 auto" }}>
    <SkeletonText size="h2" width="200px" margin="0 auto 20px" />
    <SkeletonText size="body" width="80%" margin="0 auto 40px" />
    <SkeletonCard padding="32px">
      <SkeletonBase height="50px" margin="0 0 20px 0" radius="12px" />
      <SkeletonBase height="50px" margin="0 0 20px 0" radius="12px" />
      <SkeletonBase height="50px" margin="0 0 20px 0" radius="12px" />
      <SkeletonBase height="150px" margin="0 0 24px 0" radius="12px" />
      <SkeletonButton width="100%" />
    </SkeletonCard>
  </div>
);
