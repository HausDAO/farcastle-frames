import { nowInSeconds } from "./helpers";

export type ProposalStatus =
  | "Unsponsored"
  | "Voting"
  | "Grace"
  | "Expired"
  | "Cancelled"
  | "Ready for Execution"
  | "Failed"
  | "Passed"
  | "Execution Failed"
  | "Unknown";

export const PROPOSAL_STATUS: { [index: string]: ProposalStatus } = {
  unsponsored: "Unsponsored",
  voting: "Voting",
  grace: "Grace",
  expired: "Expired",
  cancelled: "Cancelled",
  needsProcessing: "Ready for Execution",
  failed: "Failed",
  passed: "Passed",
  actionFailed: "Execution Failed",
  unknown: "Unknown",
};

type QueryProposal = {
  sponsored: boolean;
  cancelled: boolean;
  passed: boolean;
  actionFailed: boolean;
  processed: boolean;
  votingStarts: string;
  votingEnds: string;
  expiration: string;
  graceEnds: string;
  votingPeriod: string;
  gracePeriod: string;
  yesBalance: string;
  noBalance: string;
  currentlyPassing: boolean;
  proposalId: string;
  maxTotalSharesAndLootAtYesVote: string;
  dao: {
    minRetentionPercent: string;
    totalShares: string;
    quorumPercent: string;
  };
};

export const percentage = (value: number, total: number) => {
  return (value / total) * 100;
};

export const checkHasQuorum = ({
  yesVotes,
  totalShares,
  quorumPercent,
}: {
  yesVotes: number;
  totalShares: number;
  quorumPercent: number;
}) => {
  return percentage(yesVotes, totalShares) >= quorumPercent;
};

export const isProposalUnsponsored = (proposal: QueryProposal): boolean => {
  return (
    !proposal.sponsored && !proposal.cancelled && !isProposalExpired(proposal)
  );
};

export const isProposalCancelled = (proposal: QueryProposal): boolean =>
  proposal.cancelled;

export const isProposalPassed = (proposal: QueryProposal): boolean =>
  proposal.passed;

export const isProposalActionFailed = (proposal: QueryProposal): boolean =>
  proposal.actionFailed;

export const isProposalInVoting = (proposal: QueryProposal): boolean => {
  const now = nowInSeconds();
  return (
    Number(proposal.votingStarts) < now && Number(proposal.votingEnds) > now
  );
};

export const isProposalInGrace = (proposal: QueryProposal): boolean => {
  const now = nowInSeconds();
  return Number(proposal.votingEnds) < now && Number(proposal.graceEnds) > now;
};

export const isProposalExpired = (proposal: QueryProposal): boolean =>
  Number(proposal.expiration) > 0 &&
  !proposal.cancelled &&
  Number(proposal.expiration) <
    Number(proposal.votingPeriod) +
      Number(proposal.gracePeriod) +
      nowInSeconds();

export const proposalNeedsProcessing = (proposal: QueryProposal): boolean =>
  !proposal.processed &&
  proposal.sponsored &&
  !proposal.cancelled &&
  nowInSeconds() > Number(proposal.graceEnds) &&
  Number(proposal.yesBalance) > Number(proposal.noBalance);

export const isProposalFailed = (proposal: QueryProposal): boolean =>
  proposal.sponsored &&
  !proposal.cancelled &&
  nowInSeconds() > Number(proposal.graceEnds) &&
  (!passedQuorum(proposal) ||
    Number(proposal.yesBalance) <= Number(proposal.noBalance));

const isMinRetentionFailure = (proposal: QueryProposal): boolean => {
  return (
    proposal.sponsored &&
    !proposal.cancelled &&
    proposal.processed &&
    !proposal.passed &&
    failedMinRetention(proposal)
  );
};

const failedMinRetention = (proposal: QueryProposal): boolean => {
  const propPercent =
    (Number(proposal.maxTotalSharesAndLootAtYesVote) *
      Number(proposal.dao.minRetentionPercent)) /
    100;

  return Number(proposal.dao.totalShares) < propPercent;
};

const isUnknownFailure = (proposal: QueryProposal): boolean => {
  return (
    proposal.sponsored &&
    !proposal.cancelled &&
    proposal.processed &&
    !proposal.passed
  );
};

export const passedQuorum = (proposal: QueryProposal): boolean => {
  return checkHasQuorum({
    yesVotes: Number(proposal.yesBalance),
    totalShares: Number(proposal.dao.totalShares),
    quorumPercent: Number(proposal.dao.quorumPercent),
  });
};

export const getProposalStatus = (proposal: QueryProposal): ProposalStatus => {
  if (isProposalUnsponsored(proposal)) {
    return PROPOSAL_STATUS["unsponsored"];
  }
  if (isProposalCancelled(proposal)) {
    return PROPOSAL_STATUS["cancelled"];
  }
  if (isProposalActionFailed(proposal)) {
    return PROPOSAL_STATUS["actionFailed"];
  }
  if (isProposalPassed(proposal)) {
    return PROPOSAL_STATUS["passed"];
  }
  if (isProposalInVoting(proposal)) {
    return PROPOSAL_STATUS["voting"];
  }
  if (isProposalInGrace(proposal)) {
    return PROPOSAL_STATUS["grace"];
  }
  // processing check needs to be before failed check
  // a failed proposal doesn't need processing unless it failed due to quorum
  if (proposalNeedsProcessing(proposal)) {
    return PROPOSAL_STATUS["needsProcessing"];
  }
  if (isProposalFailed(proposal)) {
    return PROPOSAL_STATUS["failed"];
  }
  if (isProposalExpired(proposal)) {
    return PROPOSAL_STATUS["expired"];
  }
  if (isMinRetentionFailure(proposal)) {
    return PROPOSAL_STATUS["failed"];
  }
  if (isUnknownFailure(proposal)) {
    return PROPOSAL_STATUS["failed"];
  }
  return PROPOSAL_STATUS["unknown"];
};

export const filterActive = (proposals: QueryProposal[]) => {
  const now = nowInSeconds();
  return proposals.filter((proposal) => {
    if (Number(proposal.graceEnds) > now) return;
    return proposal.currentlyPassing;
  });
};
