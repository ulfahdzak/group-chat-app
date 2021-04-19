import { Box, Button, Tooltip } from "@material-ui/core";
import React from "react";
import LanguageRoundedIcon from "@material-ui/icons/LanguageRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";

export const PublicBox = ({ groupId, groupName, sumOfMember, joinGroup }) => {
  const formatString = (name) => {
    const groupName = name.length > 15 ? `${name.slice(0, 15)} ...` : name;
    return groupName;
  };
  return (
    <Box
      display="inline-block"
      marginRight={2}
      marginBottom={2}
      width="fit-content"
      className="group__card_container"
    >
      <Tooltip
        onClick={() => joinGroup(groupId)}
        className="group__card"
        title={groupName}
        placement="top"
      >
        <Button>
          <Box display="flex" alignItems="center">
            <LanguageRoundedIcon
              style={{ width: "2.5rem", height: "2.5rem" }}
              htmlColor="white"
            />
            <Box
              marginLeft={1}
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
            >
              <h1>{formatString(groupName)}</h1>
              <h2
                style={{
                  fontSize: ".85rem",
                  fontWeight: "lighter",
                  textTransform: "lowercase",
                }}
              >
                {sumOfMember} active members.
              </h2>
            </Box>
          </Box>

          <ArrowForwardIosRoundedIcon
            className="arow__join__icon"
            htmlColor="white"
          />
        </Button>
      </Tooltip>
    </Box>
  );
};
