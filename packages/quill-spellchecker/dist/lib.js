/*!
 * {LIB} v0.1.4
 * (c) 2018 {NAME}
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// declare function train(text: string): Dictionary;
function train(text, existingDictionary) {
    if (typeof (text) !== 'string') {
        return {};
    }
    var dictionary = existingDictionary ? Object.assign({}, existingDictionary) : {};
    var word, m;
    var r = /[a-z]+/gi;
    text = text;
    while (m = r.exec(text)) {
        word = m[0];
        dictionary[word] = dictionary.hasOwnProperty(word) ? dictionary[word] + 1 : 1;
    }
    return dictionary;
}

var letters = "abcdefghijklmnopqrstuvwxyz".split("");

function edits(word) {
    var i, results = [];
    // deletion
    for (i = 0; i < word.length; i++)
        results.push(word.slice(0, i) + word.slice(i + 1));
    // transposition
    for (i = 0; i < word.length - 1; i++)
        results.push(word.slice(0, i) + word.slice(i + 1, i + 2) + word.slice(i, i + 1) + word.slice(i + 2));
    // alteration
    for (i = 0; i < word.length; i++)
        letters.forEach(function (l) {
            results.push(word.slice(0, i) + l + word.slice(i + 1));
        });
    // insertion
    for (i = 0; i <= word.length; i++)
        letters.forEach(function (l) {
            results.push(word.slice(0, i) + l + word.slice(i));
        });
    return results;
}

function max(candidates) {
    var candidate, arr = [];
    for (candidate in candidates)
        if (candidates.hasOwnProperty(candidate))
            arr.push(candidate);
    var output = Math.max.apply(null, arr);
    return output;
}

function countKeys(candidates) {
    return Object.keys(candidates).length;
}

function correct(dictionary, potentialWord) {
    if (dictionary.hasOwnProperty(potentialWord)) {
        return potentialWord;
    }
    var candidates = {};
    var list = edits(potentialWord);
    list.forEach(function (edit) {
        if (dictionary.hasOwnProperty(edit))
            candidates[dictionary[edit]] = edit;
    });
    if (countKeys(candidates) > 0)
        return candidates[max(candidates)];
    list.forEach(function (edit) {
        edits(edit).forEach(function (w) {
            if (dictionary.hasOwnProperty(w))
                candidates[dictionary[w]] = w;
        });
    });
    return countKeys(candidates) > 0 ? candidates[max(candidates)] : potentialWord;
}

function processSentence(sentence) {
    if (sentence) {
        return sentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').replace(/\s/g, '\n');
    }
    return '';
}

/**
 * Takes an array of sentences and returns a \n separated string of words.
 * @param sentences - An array of strings that represent valid sentences.
 */
function processSentences(sentences) {
    return sentences
        .map(function (sentence) { return processSentence(sentence); }) // process the individual sentences
        .filter(function (sentence) { return sentence !== ''; }) // remove empty strings
        .join('\n'); // join the remaining strings
}

var dict = "a\nability\nable\nabout\nabove\naccept\naccording\naccount\nacross\nact\naction\nactivity\nactually\nadd\naddress\nadministration\nadmit\nadult\naffect\nafter\nagain\nagainst\nage\nagency\nagent\nago\nagree\nagreement\nahead\nair\nall\nallow\nalmost\nalone\nalong\nalready\nalso\nalthough\nalways\nAmerican\namong\namount\nanalysis\nand\nanimal\nanother\nanswer\nany\nanyone\nanything\nappear\napply\napproach\narea\nargue\narm\naround\narrive\nart\narticle\nartist\nas\nask\nassume\nat\nattack\nattention\nattorney\naudience\nauthor\nauthority\navailable\navoid\naway\nbaby\nback\nbad\nbag\nball\nbank\nbar\nbase\nbe\nbeat\nbeautiful\nbecause\nbecome\nbed\nbefore\nbegin\nbehavior\nbehind\nbelieve\nbenefit\nbest\nbetter\nbetween\nbeyond\nbig\nbill\nbillion\nbit\nblack\nblood\nblue\nboard\nbody\nbook\nborn\nboth\nbox\nboy\nbreak\nbring\nbrother\nbudget\nbuild\nbuilding\nbusiness\nbut\nbuy\nby\ncall\ncamera\ncampaign\ncan\ncancer\ncandidate\ncapital\ncar\ncard\ncare\ncareer\ncarry\ncase\ncatch\ncause\ncell\ncenter\ncentral\ncentury\ncertain\ncertainly\nchair\nchallenge\nchance\nchange\ncharacter\ncharge\ncheck\nchild\nchoice\nchoose\nchurch\ncitizen\ncity\ncivil\nclaim\nclass\nclear\nclearly\nclose\ncoach\ncold\ncollection\ncollege\ncolor\ncome\ncommercial\ncommon\ncommunity\ncompany\ncompare\ncomputer\nconcern\ncondition\nconference\nCongress\nconsider\nconsumer\ncontain\ncontinue\ncontrol\ncost\ncould\ncountry\ncouple\ncourse\ncourt\ncover\ncreate\ncrime\ncultural\nculture\ncup\ncurrent\ncustomer\ncut\ndark\ndata\ndaughter\nday\ndead\ndeal\ndeath\ndebate\ndecade\ndecide\ndecision\ndeep\ndefense\ndegree\nDemocrat\ndemocratic\ndescribe\ndesign\ndespite\ndetail\ndetermine\ndevelop\ndevelopment\ndie\ndifference\ndifferent\ndifficult\ndinner\ndirection\ndirector\ndiscover\ndiscuss\ndiscussion\ndisease\ndo\ndoctor\ndog\ndoor\ndown\ndraw\ndream\ndrive\ndrop\ndrug\nduring\neach\nearly\neast\neasy\neat\neconomic\neconomy\nedge\neducation\neffect\neffort\neight\neither\nelection\nelse\nemployee\nend\nenergy\nenjoy\nenough\nenter\nentire\nenvironment\nenvironmental\nespecially\nestablish\neven\nevening\nevent\never\nevery\neverybody\neveryone\neverything\nevidence\nexactly\nexample\nexecutive\nexist\nexpect\nexperience\nexpert\nexplain\neye\nface\nfact\nfactor\nfail\nfall\nfamily\nfar\nfast\nfather\nfear\nfederal\nfeel\nfeeling\nfew\nfield\nfight\nfigure\nfill\nfilm\nfinal\nfinally\nfinancial\nfind\nfine\nfinger\nfinish\nfire\nfirm\nfirst\nfish\nfive\nfloor\nfly\nfocus\nfollow\nfood\nfoot\nfor\nforce\nforeign\nforget\nform\nformer\nforward\nfour\nfree\nfriend\nfrom\nfront\nfull\nfund\nfuture\ngame\ngarden\ngas\ngeneral\ngeneration\nget\ngirl\ngive\nglass\ngo\ngoal\ngood\ngovernment\ngreat\ngreen\nground\ngroup\ngrow\ngrowth\nguess\ngun\nguy\nhair\nhalf\nhand\nhang\nhappen\nhappy\nhard\nhave\nhe\nhead\nhealth\nhear\nheart\nheat\nheavy\nhelp\nher\nhere\nherself\nhigh\nhim\nhimself\nhis\nhistory\nhit\nhold\nhome\nhope\nhospital\nhot\nhotel\nhour\nhouse\nhow\nhowever\nhuge\nhuman\nhundred\nhusband\nI\nidea\nidentify\nif\nimage\nimagine\nimpact\nimportant\nimprove\nin\ninclude\nincluding\nincrease\nindeed\nindicate\nindividual\nindustry\ninformation\ninside\ninstead\ninstitution\ninterest\ninteresting\ninternational\ninterview\ninto\ninvestment\ninvolve\nissue\nit\nitem\nits\nitself\njob\njoin\njust\nkeep\nkey\nkid\nkill\nkind\nkitchen\nknow\nknowledge\nland\nlanguage\nlarge\nlast\nlate\nlater\nlaugh\nlaw\nlawyer\nlay\nlead\nleader\nlearn\nleast\nleave\nleft\nleg\nlegal\nless\nlet\nletter\nlevel\nlie\nlife\nlight\nlike\nlikely\nline\nlist\nlisten\nlittle\nlive\nlocal\nlong\nlook\nlose\nloss\nlot\nlove\nlow\nmachine\nmagazine\nmain\nmaintain\nmajor\nmajority\nmake\nman\nmanage\nmanagement\nmanager\nmany\nmarket\nmarriage\nmaterial\nmatter\nmay\nmaybe\nme\nmean\nmeasure\nmedia\nmedical\nmeet\nmeeting\nmember\nmemory\nmention\nmessage\nmethod\nmiddle\nmight\nmilitary\nmillion\nmind\nminute\nmiss\nmission\nmodel\nmodern\nmoment\nmoney\nmonth\nmore\nmorning\nmost\nmother\nmouth\nmove\nmovement\nmovie\nMr\nMrs\nmuch\nmusic\nmust\nmy\nmyself\nname\nnation\nnational\nnatural\nnature\nnear\nnearly\nnecessary\nneed\nnetwork\nnever\nnew\nnews\nnewspaper\nnext\nnice\nnight\nno\nnone\nnor\nnorth\nnot\nnote\nnothing\nnotice\nnow\nn't\nnumber\noccur\nof\noff\noffer\noffice\nofficer\nofficial\noften\noh\noil\nok\nold\non\nonce\none\nonly\nonto\nopen\noperation\nopportunity\noption\nor\norder\norganization\nother\nothers\nour\nout\noutside\nover\nown\nowner\npage\npain\npainting\npaper\nparent\npart\nparticipant\nparticular\nparticularly\npartner\nparty\npass\npast\npatient\npattern\npay\npeace\npeople\nper\nperform\nperformance\nperhaps\nperiod\nperson\npersonal\nphone\nphysical\npick\npicture\npiece\nplace\nplan\nplant\nplay\nplayer\nPM\npoint\npolice\npolicy\npolitical\npolitics\npoor\npopular\npopulation\nposition\npositive\npossible\npower\npractice\nprepare\npresent\npresident\npressure\npretty\nprevent\nprice\nprivate\nprobably\nproblem\nprocess\nproduce\nproduct\nproduction\nprofessional\nprofessor\nprogram\nproject\nproperty\nprotect\nprove\nprovide\npublic\npull\npurpose\npush\nput\nquality\nquestion\nquickly\nquite\nrace\nradio\nraise\nrange\nrate\nrather\nreach\nread\nready\nreal\nreality\nrealize\nreally\nreason\nreceive\nrecent\nrecently\nrecognize\nrecord\nred\nreduce\nreflect\nregion\nrelate\nrelationship\nreligious\nremain\nremember\nremove\nreport\nrepresent\nRepublican\nrequire\nresearch\nresource\nrespond\nresponse\nresponsibility\nrest\nresult\nreturn\nreveal\nrich\nright\nrise\nrisk\nroad\nrock\nrole\nroom\nrule\nrun\nsafe\nsame\nsave\nsay\nscene\nschool\nscience\nscientist\nscore\nsea\nseason\nseat\nsecond\nsection\nsecurity\nsee\nseek\nseem\nsell\nsend\nsenior\nsense\nseries\nserious\nserve\nservice\nset\nseven\nseveral\nsex\nsexual\nshake\nshare\nshe\nshoot\nshort\nshot\nshould\nshoulder\nshow\nside\nsign\nsignificant\nsimilar\nsimple\nsimply\nsince\nsing\nsingle\nsister\nsit\nsite\nsituation\nsix\nsize\nskill\nskin\nsmall\nsmile\nso\nsocial\nsociety\nsoldier\nsome\nsomebody\nsomeone\nsomething\nsometimes\nson\nsong\nsoon\nsort\nsound\nsource\nsouth\nsouthern\nspace\nspeak\nspecial\nspecific\nspeech\nspend\nsport\nspring\nstaff\nstage\nstand\nstandard\nstar\nstart\nstate\nstatement\nstation\nstay\nstep\nstill\nstock\nstop\nstore\nstory\nstrategy\nstreet\nstrong\nstructure\nstudent\nstudy\nstuff\nstyle\nsubject\nsuccess\nsuccessful\nsuch\nsuddenly\nsuffer\nsuggest\nsummer\nsupport\nsure\nsurface\nsystem\ntable\ntake\ntalk\ntask\ntax\nteach\nteacher\nteam\ntechnology\ntelevision\ntell\nten\ntend\nterm\ntest\nthan\nthank\nthat\nthe\ntheir\nthem\nthemselves\nthen\ntheory\nthere\nthese\nthey\nthing\nthink\nthird\nthis\nthose\nthough\nthought\nthousand\nthreat\nthree\nthrough\nthroughout\nthrow\nthus\ntime\nto\ntoday\ntogether\ntonight\ntoo\ntop\ntotal\ntough\ntoward\ntown\ntrade\ntraditional\ntraining\ntravel\ntreat\ntreatment\ntree\ntrial\ntrip\ntrouble\ntrue\ntruth\ntry\nturn\nTV\ntwo\ntype\nunder\nunderstand\nunit\nuntil\nup\nupon\nus\nuse\nusually\nvalue\nvarious\nvery\nvictim\nview\nviolence\nvisit\nvoice\nvote\nwait\nwalk\nwall\nwant\nwar\nwatch\nwater\nway\nwe\nweapon\nwear\nweek\nweight\nwell\nwest\nwestern\nwhat\nwhatever\nwhen\nwhere\nwhether\nwhich\nwhile\nwhite\nwho\nwhole\nwhom\nwhose\nwhy\nwide\nwife\nwill\nwin\nwind\nwindow\nwish\nwith\nwithin\nwithout\nwoman\nwonder\nword\nwork\nworker\nworld\nworry\nwould\nwrite\nwriter\nwrong\nyard\nyeah\nyear\nyes\nyet\nyou\nyoung\nyour\nyourself";

var specialChars = ['.', ',', '!', '?', '"'];
/**
 *
 * @param dictionary
 * @param sentence
 */
function correctSentence(dictionary, sentence) {
    var words = splitSentence(sentence);
    var correctedWords = words.map(function (word) {
        return correctWord(dictionary, word);
    });
    return correctedWords.join(' ');
}
function splitSentence(sentence) {
    return sentence.split(' ');
}

function correctWord(dictionary, word) {
    var _a = removeSpecialCharsFromWord(word), start = _a[0], middle = _a[1], end = _a[2];
    return [start, correct(dictionary, middle), end].join('');
}
function removeSpecialCharsFromStart(word) {
    var index = 0;
    while (specialChars.indexOf(word[index]) !== -1) {
        index += 1;
    }
    return [word.substring(index), word.substring(0, index)];
}
function removeSpecialCharsFromEnd(word) {
    var index = word.length - 1;
    while (specialChars.indexOf(word[index]) !== -1) {
        index -= 1;
    }
    return [word.substring(0, index + 1), word.substring(index + 1)];
}
function removeSpecialCharsFromWord(word) {
    var _a = removeSpecialCharsFromStart(word), remainder = _a[0], start = _a[1];
    var _b = removeSpecialCharsFromEnd(remainder), middle = _b[0], end = _b[1];
    return [start, middle, end];
}

function correctSentenceFromSamples(samples, sentence, useCommon) {
    var dictstring = processSentences(samples);
    if (useCommon) {
        dictstring = dictstring + "\n" + dict;
    }
    var dictionary = train(dictstring);
    return correctSentence(dictionary, sentence);
}

exports.train = train;
exports.correct = correct;
exports.edits = edits;
exports.correctSentenceFromSamples = correctSentenceFromSamples;
exports.processSentences = processSentences;
