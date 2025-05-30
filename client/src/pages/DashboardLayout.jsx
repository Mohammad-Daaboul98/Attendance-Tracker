import { useEffect, useState } from "react";
import { Navbar } from "../components";
import {
  Button,
  Flex,
  Box,
  useColorModeValue,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import {
  Outlet,
  redirect,
  useNavigate,
  useNavigation,
  useOutletContext,
} from "react-router-dom";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import customFetch from "../utils/customFetch";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const userQuery = {
  queryKey: ["user"],
  queryFn: async () => {
    const { data } = await customFetch.get("/users/current-user");
    return data;
  },
};

export const loader = (queryClient) => async () => {
  try {
    return await queryClient.ensureQueryData(userQuery);
  } catch (error) {
    return redirect("/");
  }
};

function DashboardLayout({ queryClient }) {
  const { data: user } = useQuery(userQuery);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const {
    pageMode: { colorMode, toggleColorMode },
  } = useOutletContext();

  const bg = useColorModeValue("gray.100", "#2D3748");
  const color = useColorModeValue("black", "#e0e0e1");

  const [isAuthError, setIsAuthError] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const showSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleSidebar = () => {
    setCollapsed(false);
    setToggled(true);
  };

  const logoutUser = async () => {
    navigate("/");
    await customFetch.get("/auth/logout");
    queryClient.invalidateQueries();
    toast.success("تم تسجيل الخروج");
  };

  const sidebarProps = {
    toggled,
    collapsed,
    setToggled,
    showSidebar,
    logoutUser,
  };

  customFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 401) {
        setIsAuthError(true);
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (!isAuthError) return;
    logoutUser();
  }, [isAuthError]);

  return (
    <Flex>
      <Box minHeight="100vh" w={{ base: "0", md: "0", lg: "auto" }}>
        <Navbar sidebarProps={sidebarProps} />
      </Box>
      <Flex w="100%" flexDirection="column" overflow="hidden">
        <Box
          position="sticky"
          top="0"
          display="flex"
          alignItems="center"
          p={{ lg: "20px 45px", md: "10px 20px", base: "10px" }}
          bg={bg}
          h={{ lg: "100px", md: "70px", base: "70px" }}
          zIndex="1"
        >
          <Flex justifyContent="space-between" alignItems="center" w="100%">
            <Box>
              <Button
                bg="transparent"
                color={color}
                _hover={{ bg: "transparent" }}
                fontSize="25px"
                display={{ base: "flex", md: "flex", sm: "flex", lg: "none" }}
                onClick={toggleSidebar}
              >
                <FaBars />
              </Button>

              <Button
                mr="auto"
                bg="transparent"
                color={color}
                _hover={{ bg: "transparent" }}
                display={{ base: "none", md: "none", lg: "flex" }}
                fontSize="25px"
                onClick={showSidebar}
              >
                <FaBars />
              </Button>
            </Box>

            <Button variant="mode" padding={0} onClick={toggleColorMode}>
              {colorMode === "light" ? (
                <MoonIcon boxSize={{ base: 5, md: 6 }} color="#234e52" />
              ) : (
                <SunIcon boxSize={{ base: 5, md: 6 }} color="orange" />
              )}
            </Button>
          </Flex>
        </Box>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
          >
            <Spinner size="xl" />
          </Box>
        ) : (
          <Outlet context={{ user }} />
        )}
      </Flex>
    </Flex>
  );
}

export default DashboardLayout;
