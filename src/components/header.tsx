import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Link,
    Image,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useBreakpointValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Avatar,
    Center,
    useDisclosure,
} from '@chakra-ui/react';
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons';
import logo from '../assets/coral-trimmy.png';
import {Link as RouterLink} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';

export default function Header() {
    const {isOpen, onToggle} = useDisclosure();
    const auth = useAuth();
    const user = auth?.user;

    const NAV_ITEMS = (user && user?.account?.role == 1) ? USER_NAV_ITEMS : user?.account?.role == 2 ? ADMIN_NAV_ITEMS : RES_NAV_ITEMS;


    return (
        <Box
            position={'fixed'}
            zIndex={2}
            width={'100%'}>
            <Flex
                bg={'#005A80'}
                color={'white'}
                minH={'60px'}
                py={{base: 2}}
                px={{base: 4}}
                alignItems={'center'}
                justify={'space-between'}
                width={'100%'}>
                <IconButton
                    display={{base: 'block', md: 'none'}}
                    onClick={onToggle}
                    icon={
                        isOpen ? <CloseIcon w={3} h={3}/> : <HamburgerIcon w={5} h={5}/>
                    }
                    variant={'ghost'}
                    aria-label={'Toggle Navigation'}
                />
                <Box>
                    <Image
                        src={logo}
                        height={'40px'}/>
                </Box>

                <Stack
                    // justify={'flex-end'}
                    direction={'row'}
                    spacing={6}>
                    <Flex display={{base: 'none', md: 'flex'}} ml={10}>
                        <DesktopNav navItems={NAV_ITEMS}/>
                    </Flex>
                    {
                        user ? <Menu>
                                <MenuButton
                                    as={Button}
                                    rounded={'full'}
                                    variant={'link'}
                                    cursor={'pointer'}
                                    minW={0}
                                >
                                    <Avatar
                                        size={'sm'}
                                        name={user?.account?.firstName + ' ' + user.account?.lastName}
                                        src={user?.account?.avatar}
                                    />
                                </MenuButton>
                                <MenuList bg={'#005A80'}>

                                    <br/>
                                    <Center>
                                        <Avatar
                                            size={'2xl'}
                                            name={user?.account?.firstName + ' ' + user.account?.lastName}
                                            src={user?.account?.avatar}
                                        />
                                    </Center>
                                    <br/>
                                    <Center>
                                        <p>{user?.account?.firstName + ' ' + user.account?.lastName}</p>
                                    </Center>
                                    <br/>
                                    <MenuDivider/>
                                    <MenuItem
                                        _focus={{bg: '#337B99'}} as={RouterLink} to={'/user/gallery'}>My Gallery</MenuItem>
                                    <MenuItem
                                        _focus={{bg: '#337B99'}}>Account Settings</MenuItem>
                                    <MenuItem
                                        _focus={{bg: '#337B99'}} onClick={() => auth.signout()}>Logout</MenuItem>
                                </MenuList>
                            </Menu> :
                            <>
                                <Button
                                    as={RouterLink}
                                    to={'/auth/signin'}
                                    fontSize={'sm'}
                                    fontWeight={400}
                                    color={'white'}
                                    variant={'link'}>
                                    Sign In
                                </Button>
                                <Button
                                    as={RouterLink}
                                    to={'/auth/signup'}
                                    display={{base: 'none', md: 'inline-flex'}}
                                    fontSize={'sm'}
                                    fontWeight={600}
                                    color={'white'}
                                    bg={'#FFA57F'}
                                    _hover={{
                                        bg: '#E69E7F',
                                    }}>
                                    Sign Up
                                </Button>
                            </>
                    }
                </Stack>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav navItems={NAV_ITEMS}/>
            </Collapse>
        </Box>
    );
}

const DesktopNav = ({navItems}:{navItems:Array<NavItem>}) => {
    const linkColor = 'white';
    const linkHoverColor = 'white';
    const popoverContentBgColor = '#4D8CA6';

    return (
        <Stack direction={'row'} spacing={4}>
            {navItems.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                        <PopoverTrigger>
                            <Link
                                as={RouterLink}
                                to={navItem.href ?? '#'}
                                p={2}
                                fontSize={'sm'}
                                fontWeight={500}
                                color={linkColor}
                                whiteSpace={'nowrap'}
                                lineHeight={'40px'}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}>
                                {navItem.label}
                            </Link>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow={'xl'}
                                bg={popoverContentBgColor}
                                p={4}
                                rounded={'xl'}
                                minW={'sm'}>
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <DesktopSubNav key={child.label} {...child} />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    );
};

const DesktopSubNav = ({label, href, subLabel}: NavItem) => {
    return (
        <Link
            color={'white'}
            as={RouterLink}
            to={href ?? '#'}
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}
            _hover={{bg: 'gray.900'}}>
            <Stack direction={'row'} align={'center'}>
                <Box>
                    <Text
                        transition={'all .3s ease'}
                        _groupHover={{color: 'pink.400'}}
                        fontWeight={500}>
                        {label}
                    </Text>
                    <Text fontSize={'sm'}>{subLabel}</Text>
                </Box>
                <Flex
                    transition={'all .3s ease'}
                    transform={'translateX(-10px)'}
                    opacity={0}
                    _groupHover={{opacity: '100%', transform: 'translateX(0)'}}
                    justify={'flex-end'}
                    align={'center'}
                    flex={1}>
                    <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon}/>
                </Flex>
            </Stack>
        </Link>
    );
};

const MobileNav = ({navItems}:{navItems:Array<NavItem>}) => {
    return (
        <Stack
            bg={'gray.800'}
            p={4}
            display={{md: 'none'}}>
            {navItems.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
        </Stack>
    );
};

const MobileNavItem = ({label, children, href}: NavItem) => {
    const {isOpen, onToggle} = useDisclosure();

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Flex
                py={2}
                as={Link}
                href={href ?? '#'}
                justify={'space-between'}
                align={'center'}
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text
                    fontWeight={600}
                    color={'gray.200'}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Flex>

            <Collapse in={isOpen} animateOpacity style={{marginTop: '0!important'}}>
                <Stack
                    mt={2}
                    color={'white'}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={'gray.700'}
                    align={'start'}>
                    {children &&
                    children.map((child) => (
                        <Link key={child.label} py={2}
                              as={RouterLink}
                              to={child.href ?? '#'}>
                            {child.label}
                        </Link>
                    ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};

interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
}

const USER_NAV_ITEMS: Array<NavItem> = [
    {
        label: 'Home',
        href: '/',
    },
    {
        label: 'Coral taxonomy',
        href: '/taxonomy',
    },
    {
        label: 'Gallery',
        href: '/articles',
    },
    {
        label: 'Articles',
        href: '/articles',
    }
];

const ADMIN_NAV_ITEMS: Array<NavItem> = [
    {
        label: 'Home',
        href: '/',
    },
    {
        label: 'Coral taxonomy',
        href: '/taxonomy',
    },
    {
        label: 'Gallery',
        href: '/articles',
    },
    {
        label: 'Articles',
        href: '/articles',
    },
    {
        label: 'ADMIN',
        href: '/Admin',
    },
];

const RES_NAV_ITEMS: Array<NavItem> = [
    {
        label: 'Home',
        href: '/',
    },
    {
        label: 'Coral taxonomy',
        href: '/taxonomy',
    },
    {
        label: 'Gallery',
        href: '/articles',
    },
    {
        label: 'Articles',
        href: '/articles',
    },
    {
        label: 'Contribute',
        children: [
            {
                label: 'Todo factsheet',
                href: '/researcher/todo',
            },
            {
                label: 'My Contribute',
                href: '/researcher/contribute',
            },
            {
                label: 'Image labeling',
                href: '/researcher/image-label',
            }
        ],
    },
];

