import Image from "next/image";

const Logo = () => {
  return (
    <Image height={80} width={80} alt="Logo" src="/assets/images/logo.svg" />
  );
};

export default Logo;
