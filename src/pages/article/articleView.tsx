import React from "react";
import {Box, Center, Container, Heading, HStack, Image, Tag, Text, VStack} from "@chakra-ui/react";

export default function ArticleView() {
    return (
        <>
            <Container maxW={'container.xl'} py={2}>
                <HStack spacing={2}>
                    <Tag color={'#005A80'}>Coral</Tag>
                    <Tag color={'#005A80'}>News</Tag>
                </HStack>
                <Heading as={'h1'}>Scientists found a new genus of life in the remote Pacific Ocean</Heading>
                <HStack pb={8}>
                    <Text fontWeight="medium">Coral researcher</Text>
                    <Text>-</Text>
                    <Text>{(new Date().toLocaleDateString())}</Text>
                </HStack>
                <Text fontSize='2xl'>It’s not every day you find an entirely new group of life. But keen-eyed scientists in the Line Islands spotted a strange-looking seaweed in 2009, and have just published their description of it.</Text>
                <Center w={'100%'}>
                    <Image src={'https://miro.medium.com/max/640/1*lpfuy_EhS92Z26RJ0L0Zxw.jpeg'}/>
                </Center>
                <div dangerouslySetInnerHTML={createMarkup()}></div>
            </Container>
        </>
    );
}

function createMarkup() {
    return {__html: '<p id="fdad" class="pw-post-body-paragraph xo xp xq sp b xr xs xt xu xv xw xx xy xz ya yb yc yd ye yf yg yh yi yj yk yl qi by" data-selectable-paragraph="">It&rsquo;s not every day you find an entirely new group of life. But keen-eyed scientists in the Line Islands spotted a strange-looking seaweed in 2009, and have just published their description of it.</p>\n' +
            '<p id="8019" class="pw-post-body-paragraph xo xp xq sp b xr xs xt xu xv xw xx xy xz ya yb yc yd ye yf yg yh yi yj yk yl qi by" data-selectable-paragraph="">The new species was found in Kiribati (pronounced Kiribass), a unique island nation in the Pacific. It gained independence from the United Kingdom in 1979. It is the only country in the world to be located in all four hemispheres of the globe. Its easternmost islands are in the most advanced time zone on Earth, and the International Date Line actually bends around the nation to keep all its islands on the same day.</p>\n' +
            '<p id="0f67" class="pw-post-body-paragraph xo xp xq sp b xr xs xt xu xv xw xx xy xz ya yb yc yd ye yf yg yh yi yj yk yl qi by" data-selectable-paragraph="">The scientists dubbed the new species&nbsp;<em class="zb">Brilliantia kiribatiensis</em>, currently the only one in its genus. They justified the new genus because of the unique nature of its appearance &mdash; what scientists call morphology.</p>\n' +
            '<p id="c8b3" class="pw-post-body-paragraph xo xp xq sp b xr xs xt xu xv xw xx xy xz ya yb yc yd ye yf yg yh yi yj yk yl qi by" data-selectable-paragraph="">Their manuscript describes the species this way: &ldquo;a very simple architecture forming upright, unbranched, single-celled filaments attached to the substratum by a rhizoidal mat.&rdquo; Translation: it is basically underwater grass where each blade is a single cell.</p>\n' +
            '<figure class="yn yo yp yq wk yr">\n' +
            '<div class="ic y cu">\n' +
            '<div class="anw rk y"><iframe class="mf ah ai cx ae" title="Jennifer Smith on Twitter: &quot;Introducing the new species and GENUS of #seaweed from the remote southern Line Islands to the world. I first found this beauty in 2009 and was immediately perplexed! Thanks @fleliaer, @NG_PristineSeas, @GovKiribati, @WHOI, @Scripps_Ocean for making this come together! #Phycology pic.twitter.com/WYm0WlCoZO / Twitter&quot;" src="https://cdn.embedly.com/widgets/media.html?type=text%2Fhtml&amp;key=a19fcc184b9711e1b4764040d3dc5c07&amp;schema=twitter&amp;url=https%3A//twitter.com/smithcoralreef/status/1470495301626699783&amp;image=https%3A//i.embed.ly/1/image%3Furl%3Dhttps%253A%252F%252Fabs.twimg.com%252Ferrors%252Flogo46x38.png%26key%3Da19fcc184b9711e1b4764040d3dc5c07" width="655" height="770" frameborder="0" scrolling="auto" allowfullscreen="allowfullscreen"></iframe></div>\n' +
            '</div>\n' +
            '</figure>\n' +
            '<p id="1ad4" class="pw-post-body-paragraph xo xp xq sp b xr xs xt xu xv xw xx xy xz ya yb yc yd ye yf yg yh yi yj yk yl qi by" data-selectable-paragraph="">Kiribati is known for its coral reefs, abundant across the many atolls of the nation. They are considered some of the most remote in the world, and because of that, their biodiversity is unique.</p>\n' +
            '<p id="a3d8" class="pw-post-body-paragraph xo xp xq sp b xr xs xt xu xv xw xx xy xz ya yb yc yd ye yf yg yh yi yj yk yl qi by" data-selectable-paragraph="">These islands have had minimal human impact compared to the rest of the world, and yet they are still experiencing the threat of climate change. Rising seas threaten all of the low-lying land available to the people of Kiribati. You may have seen the Tuvalu minister giving a speech knee-deep in water to show their plight. Only a few hundred miles away, Kiribati is facing the same fate.</p>\n' +
            '<p id="27e7" class="pw-post-body-paragraph xo xp xq sp b xr xs xt xu xv xw xx xy xz ya yb yc yd ye yf yg yh yi yj yk yl qi by" data-selectable-paragraph="">There is still so much biodiversity to be discovered and described in these remote coral reefs. Unless we take action quickly, much of it will be lost before it is ever known to humanity.</p>\n' +
            '<p id="73e0" class="pw-post-body-paragraph xo xp xq sp b xr xs xt xu xv xw xx xy xz ya yb yc yd ye yf yg yh yi yj yk yl qi by" data-selectable-paragraph="">Find the entire new species description here:&nbsp;<a class="ay pp" href="https://onlinelibrary.wiley.com/doi/10.1111/jpy.13230" target="_blank" rel="noopener ugc nofollow">https://onlinelibrary.wiley.com/doi/10.1111/jpy.13230</a></p>'};
}
