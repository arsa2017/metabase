import { Fragment, useMemo } from "react";
import { c } from "ttag";

import Link from "metabase/common/components/Link";
import { SidesheetCardSection } from "metabase/common/components/Sidesheet";
import { useSelector } from "metabase/lib/redux";
import { getQuestionWithoutComposing } from "metabase/query_builder/selectors";
import { Flex, FixedSizeIcon as Icon } from "metabase/ui";

import { getDataSourceParts } from "../../../ViewHeader/components/QuestionDataSource/utils";

import type { QuestionSource } from "./types";
import { getIconPropsForSource } from "./utils";

export const QuestionSources = () => {
  /** Retrieve current question from the Redux store */
  const underlyingQuestion = useSelector(getQuestionWithoutComposing);

  const sourcesWithIcons: QuestionSource[] = useMemo(() => {
    const sources = underlyingQuestion
      ? (getDataSourceParts({
          question: underlyingQuestion,
          subHead: false,
          isObjectDetail: true,
          formatTableAsComponent: false,
        }) as QuestionSource[])
      : [];
    return sources.map((source) => ({
      ...source,
      iconProps: getIconPropsForSource(source),
    }));
  }, [underlyingQuestion]);

  if (!underlyingQuestion || !sourcesWithIcons.length) {
    return null;
  }

  const title = c(
    "This is a heading that appears above the names of the database, table, and/or question that a question is based on -- the 'sources' for the question. Feel free to translate this heading as though it said 'Based on these sources', if you think that would make more sense in your language.",
  ).t`Based on`;

  return (
    <SidesheetCardSection title={title}>
      <Flex gap="sm" align="flex-start">
        {sourcesWithIcons.map(({ href, name, iconProps }, index) => (
          <Fragment key={`${href}-${name}`}>
            <Link to={href} variant="brand">
              <Flex gap="sm" lh="1.25rem" maw="20rem">
                {iconProps ? (
                  <Icon mt={2} c="text-dark" {...iconProps} />
                ) : null}
                {name}
              </Flex>
            </Link>
            {index < sourcesWithIcons.length - 1 && (
              <Flex lh="1.25rem">{"/"}</Flex>
            )}
          </Fragment>
        ))}
      </Flex>
    </SidesheetCardSection>
  );
};
