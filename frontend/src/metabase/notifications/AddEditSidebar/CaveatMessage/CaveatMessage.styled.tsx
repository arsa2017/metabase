// eslint-disable-next-line no-restricted-imports
import styled from "@emotion/styled";

import Text from "metabase/common/components/type/Text";
import { alpha, color } from "metabase/lib/colors";

export const CaveatText = styled(Text)`
  margin-left: 2rem;
  margin-right: 2rem;
  margin-top: 1rem;
  padding: 0.8rem;
  color: var(--mb-color-text-dark);
  line-height: 1.25rem;
  border-radius: 8px;
  background-color: ${() => alpha("accent4", 0.05)};
  border: 1px solid ${() => color("accent4")};
`;
