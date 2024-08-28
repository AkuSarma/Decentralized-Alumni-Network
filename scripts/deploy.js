async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy AlumniToken contract
  const AlumniToken = await ethers.getContractFactory("AlumniToken");
  const token = await AlumniToken.deploy(1000000);
  await token.deployed();
  console.log("AlumniToken deployed to:", token.address);

  // Deploy AlumniTreasury contract
  const AlumniTreasury = await ethers.getContractFactory("AlumniTreasury");
  const treasury = await AlumniTreasury.deploy(deployer.address);
  await treasury.deployed();
  console.log("AlumniTreasury deployed to:", treasury.address);

  // Deploy AlumniDAO contract
  const AlumniDAO = await ethers.getContractFactory("AlumniDAO");
  const dao = await AlumniDAO.deploy(token.address, treasury.address);
  await dao.deployed();
  console.log("AlumniDAO deployed to:", dao.address);

  // Deploy Mentorship contract
  const Mentorship = await ethers.getContractFactory("Mentorship");
  const mentorship = await Mentorship.deploy(token.address);
  await mentorship.deployed();
  console.log("Mentorship deployed to:", mentorship.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
