import React, { ReactNode } from 'react';
import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
} from '@chakra-ui/react';
import {
    FiMenu,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface LinkItemProps {
    name: string;
    icon?: IconType;
    href: string;
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Factsheet request', href: '/admin/draft' },
    { name: 'Media request', href: '/admin/species-media' },
    { name: 'Labeled image', href: '/admin/label-image'},
    { name: 'Articles', href: '/admin/articles'},
    { name: 'Species', href: '/admin/species' },
    { name: 'Genus', href: '/admin/genus' },
    { name: 'Diving session', href: '/admin/divingSession' },
    { name: 'Account', href: '/admin/account' },
];

export default function SimpleSidebar({ children }: { children: ReactNode }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box minH="100vh">
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                {children}
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            bg={'white'}
            borderRight="1px"
            borderRightColor={'gray.200'}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
            py={2}>
            <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} href={link.href}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

interface NavItemProps extends FlexProps {
    icon?: IconType;
    children: ReactText;
    href: string;
}
const NavItem = ({ icon, href, children, ...rest }: NavItemProps) => {
    return (
        <Link to={href} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }} as={RouterLink}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: '#669CB3',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

interface MobileProps extends FlexProps {
    onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 24 }}
            height="20"
            alignItems="center"
            bg={'white'}
            borderBottomWidth="1px"
            borderBottomColor={'gray.200'}
            justifyContent="flex-start"
            {...rest}>
            <IconButton
                variant="outline"
                onClick={onOpen}
                aria-label="open menu"
                icon={<FiMenu />}
            />
        </Flex>
    );
};
